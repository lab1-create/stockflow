require("dotenv").config();

const path = require("path");
const os = require("os");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Pool } = require("pg");

const AuthController = require("./controllers/AuthController");
const UsuarioController = require("./controllers/UsuarioController");
const ProdutoController = require("./controllers/ProdutoController");
const EstoqueController = require("./controllers/EstoqueController");
const AuthService = require("./services/AuthService");
const UsuarioService = require("./services/UsuarioService");
const ProdutoService = require("./services/ProdutoService");
const EstoqueService = require("./services/EstoqueService");
const RelatorioService = require("./services/RelatorioService");
const RealtimeService = require("./services/RealtimeService");
const createAuthRoutes = require("./routes/auth");
const createUsuariosRoutes = require("./routes/usuarios");
const createProdutosRoutes = require("./routes/produtos");
const createEstoqueRoutes = require("./routes/estoque");
const createRelatoriosRoutes = require("./routes/relatorios");
const authMiddleware = require("./middleware/auth");

const app = express();
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "0.0.0.0";
const databaseUrl = process.env.DATABASE_URL;
const databaseSsl = process.env.DATABASE_SSL === "true" || /sslmode=require/i.test(databaseUrl || "");
const jwtSecret = process.env.JWT_SECRET || "fallback-secret-dev";

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: databaseSsl ? { rejectUnauthorized: false } : false
});

const realtimeService = new RealtimeService();
const authService = new AuthService(pool, jwtSecret);
const usuarioService = new UsuarioService(pool);
const produtoService = new ProdutoService(pool);
const estoqueService = new EstoqueService(pool);
const relatorioService = new RelatorioService(pool);

const authController = new AuthController(authService);
const usuarioController = new UsuarioController(usuarioService);
const produtoController = new ProdutoController(produtoService, realtimeService);
const estoqueController = new EstoqueController(estoqueService, relatorioService, realtimeService);

app.disable("x-powered-by");
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", async (_req, res, next) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

// === NOVA ROTA: BOOTSTRAP PARA CARREGAMENTO INICIAL DO FRONTEND ===
app.get("/api/bootstrap", authMiddleware(jwtSecret), async (req, res, next) => {
  try {
    // Procura os dados consolidados utilizando os métodos existentes nos seus serviços
    const dashboard = typeof relatorioService.getDashboardData === "function" 
      ? await relatorioService.getDashboardData() 
      : {};

    const items = typeof produtoService.listarTodos === "function"
      ? await produtoService.listarTodos()
      : (typeof produtoService.list === "function" ? await produtoService.list() : []);

    const history = typeof estoqueService.listarHistorico === "function"
      ? await estoqueService.listarHistorico()
      : [];

    const requests = typeof estoqueService.listarSolicitacoesPendentes === "function"
      ? await estoqueService.listarSolicitacoesPendentes()
      : [];

    // Listas auxiliares padrão para os seletores (pode ligar a tabelas se existirem no futuro)
    const technicians = ["Técnico Alfa", "Técnico Beta", "Técnico Gama"];
    const destinations = ["Laboratório", "Campo", "Cliente Final", "Infraestrutura"];

    res.json({
      items,
      history,
      requests,
      technicians,
      destinations,
      dashboard
    });
  } catch (error) {
    next(error);
  }
});

app.use("/api", createAuthRoutes(authController));
app.use("/api", authMiddleware(jwtSecret));
app.use("/api/usuarios", createUsuariosRoutes(usuarioController));
app.use("/api/produtos", createProdutosRoutes(produtoController));
app.use("/api/items", createProdutosRoutes(produtoController));
app.use("/api", createEstoqueRoutes(estoqueController));
app.use("/api/relatorios", createRelatoriosRoutes(relatorioService));

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({
    error: error.message || "Erro interno."
  });
});

app.listen(port, host, () => {
  console.log(`Servidor rodando em http://${host}:${port}`);
});
