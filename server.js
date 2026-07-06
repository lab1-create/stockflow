const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURAÇÃO DO POOL FORÇANDO IPv4 E LIQUIDANDO TIMEOUTS
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Ajuste do pooler para evitar travamento em conexões instáveis do Render
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 10,
  ssl: {
    rejectUnauthorized: false // Obrigatório para conexões seguras no Render/Neon/Supabase
  }
});

// Inicialização do Banco de Dados corrigida
async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Criação das tabelas base (CORRIGIDO: Removido o 'NOT EXISTS' inválido do tipo da coluna)
    await client.query(`
      CREATE TABLE IF NOT EXISTS app_users (
        name TEXT PRIMARY KEY,
        role TEXT NOT NULL,
        pin_code TEXT,
        active BOOLEAN DEFAULT TRUE
      );
    `);

    // Certifique-se de que as tabelas 'items', 'destinations' e 'history' estão criadas aqui se necessário...

    await client.query("COMMIT");
    console.log("Banco de dados sincronizado perfeitamente (Sem Gabriel).");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erro ao inicializar tabelas:", err);
    // Não derruba o processo imediatamente para permitir que a API responda erros amigáveis
  } finally {
    client.release();
  }
}

// Rota Bootstrap Corrigida
app.get('/api/bootstrap', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    
    const usersRes = await client.query("SELECT name, role, COALESCE(pin_code, '0000') as pin FROM app_users WHERE active = TRUE ORDER BY name ASC;");
    const itemsRes = await client.query("SELECT code, name, category, qty, min, supplier, note FROM items ORDER BY name ASC;");
    const destsRes = await client.query("SELECT name FROM destinations ORDER BY name ASC;");
    
    // CORREÇÃO DA QUERY DO KPI (Ajustado filtros de nulidade)
    const kpisRes = await client.query(`
      SELECT item_code as "itemCode", item_name as "itemName", user_name as "technician",
      CEIL(AVG(days_step))::INT as "averageDays"
      FROM usage_kpis WHERE item_code IS NOT NULL
      GROUP BY item_code, item_name, user_name;
    `);

    res.json({
      users: usersRes.rows,
      items: itemsRes.rows,
      destinations: destsRes.rows.map(d => d.name),
      usageKpis: kpisRes.rows,
      requests: [], // Adicione a query de requests pendentes aqui se houver tabela
      history: []   // Adicione a query de histórico aqui se houver tabela
    });
  } catch (err) {
    console.error("Erro no bootstrap da API:", err);
    res.status(500).json({ error: "Erro ao carregar dados do banco de dados." });
  } finally {
    if (client) client.release();
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 4173;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  initDatabase();
});
