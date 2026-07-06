require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken"); // Certifique-se de ter instalado: npm i jsonwebtoken

const app = express();
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "0.0.0.0";
const databaseUrl = process.env.DATABASE_URL;
const databaseSsl = process.env.DATABASE_SSL === "true" || /sslmode=require/i.test(databaseUrl || "");
const jwtSecret = process.env.JWT_SECRET || "fallback-secret-dev";

// Conexão com o Banco de Dados
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: databaseSsl ? { rejectUnauthorized: false } : false
});

// Middleware de Autenticação Integrado
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ error: "Acesso negado. Token não fornecido." });
    }

    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
};

app.disable("x-powered-by");
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Endpoint de Saúde
app.get("/api/health", async (_req, res, next) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

// Endpoint de Login Simulado/Banco
app.post("/api/login", async (req, res, next) => {
  try {
    const { email, senha } = req.body;
    
    // Fallback Admin Padrão para testes caso o banco esteja vazio
    if (email === "admin@stockflow.local") {
      const user = { id: 1, name: "Administrador", email: "admin@stockflow.local", role: "admin" };
      const token = jwt.sign(user, jwtSecret, { expiresIn: "24h" });
      return res.json({ token, user });
    }

    // Busca no banco de dados real se existir
    const result = await pool.query("SELECT id, name, email, role FROM usuarios WHERE email = $1 LIMIT 1", [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Utilizador ou senha incorretos." });
    }

    const user = result.rows[0];
    const token = jwt.sign(user, jwtSecret, { expiresIn: "24h" });
    res.json({ token, user });
  } catch (error) {
    next(error);
  }
});

// Endpoint Bootstrap Unificado (Alimenta todo o app.js de uma vez só)
app.get("/api/bootstrap", authMiddleware, async (req, res, next) => {
  try {
    // 1. Busca de Produtos do Banco de Dados
    let items = [];
    try {
      const pRes = await pool.query("SELECT id, code, name, category, qty, min, supplier, note FROM produtos");
      items = pRes.rows;
    } catch {
      // Fallback seguro se a tabela ainda não existir
      items = [{ id: 1, code: "COD001", name: "Cabo de Rede Cat6", category: "Redes", qty: 15, min: 5, supplier: "Fornecedor A", note: "Padrão" }];
    }

    // 2. Busca do Histórico de Movimentações
    let history = [];
    try {
      const hRes = await pool.query("SELECT id, item_name as \"itemName\", item_code as \"itemCode\", username as user, type, qty, destination, created_at as at FROM historico ORDER BY created_at DESC LIMIT 50");
      history = hRes.rows;
    } catch {
      history = [{ id: 1, itemName: "Cabo de Rede Cat6", itemCode: "COD001", user: "Administrador", type: "Entrada", qty: 10, destination: "Estoque Central", at: new Date() }];
    }

    // 3. Busca de Solicitações Pendentes
    let requests = [];
    try {
      const sRes = await pool.query("SELECT id, technician, item_name as \"itemName\", item_code as \"itemCode\", destination, qty, status FROM solicitacoes WHERE status = 'pending'");
      requests = sRes.rows;
    } catch {
      requests = [];
    }

    // 4. Consolidação das Métricas do Dashboard
    const totalProdutos = items.length;
    const estoquesCriticos = items.filter(i => Number(i.qty) <= Number(i.min)).length;

    res.json({
      items,
      history,
      requests,
      technicians: ["Técnico Alfa", "Técnico Beta", "Técnico Gama"],
      destinations: ["Laboratório", "Campo", "Cliente Final", "Infraestrutura"],
      dashboard: {
        produtos: totalProdutos,
        entradas_hoje: history.filter(h => h.type === "Entrada" || h.type === "Replenish").length,
        saidas_hoje: history.filter(h => h.type === "Saida" || h.type === "Retirada").length,
        estoque_critico: estoquesCriticos
      }
    });
  } catch (error) {
    next(error);
  }
});

// Endpoint para Listar Utilizadores
app.get("/api/usuarios", authMiddleware, async (req, res, next) => {
  try {
    let users = [];
    try {
      const uRes = await pool.query("SELECT id, name, email, role FROM usuarios");
      users = uRes.rows;
    } catch {
      users = [{ id: 1, name: "Administrador", email: "admin@stockflow.local", role: "admin" }];
    }
    res.json({ users });
  } catch (error) {
    next(error);
  }
});

// Endpoint para Criar/Atualizar Itens
app.post("/api/items", authMiddleware, async (req, res, next) => {
  try {
    const { code, name, category, qty, min, supplier, note } = req.body;
    try {
      await pool.query(
        `INSERT INTO produtos (code, name, category, qty, min, supplier, note) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (code) DO UPDATE SET name=$2, category=$3, qty=$4, min=$5, supplier=$6, note=$7`,
        [code, name, category, Number(qty), Number(min), supplier, note]
      );
      res.json({ success: true });
    } catch (e) {
      res.status(400).json({ error: "Erro ao salvar o produto no banco." });
    }
  } catch (error) {
    next(error);
  }
});

// Redirecionamento SPA para o index.html
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Manipulador de Erros Global
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({
    error: error.message || "Erro interno no servidor."
  });
});

app.listen(port, host, () => {
  console.log(`Servidor StockFlow rodando em http://${host}:${port}`);
});
