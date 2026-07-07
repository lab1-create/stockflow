🌐 SUPABASE + STOCKFLOW - COMECE AQUI
═══════════════════════════════════════════════════════════════════════════════

Você quer colocar o StockFlow ONLINE usando Supabase (banco na nuvem) + Render.

Tempo total: ~30 minutos

═══════════════════════════════════════════════════════════════════════════════

🚀 4 PASSOS PRINCIPAIS
────────────────────────────────────────────────────────────────────────────

1. SUPABASE
   └─ Criar banco PostgreSQL na nuvem
   └─ Tempo: 5 minutos

2. SCHEMA + SEED
   └─ Criar tabelas no Supabase
   └─ Adicionar dados iniciais
   └─ Tempo: 10 minutos

3. RENDER
   └─ Deploy da aplicação
   └─ Conecta ao Supabase
   └─ Tempo: 10 minutos

4. USAR ONLINE
   └─ Acessar pela URL gerada
   └─ Compartilhar com equipe
   └─ Tempo: 2 minutos


═══════════════════════════════════════════════════════════════════════════════

📖 GUIAS PASSO-A-PASSO
────────────────────────────────────────────────────────────────────────────

Leia em ordem:

1️⃣  SUPABASE-PASSO-A-PASSO.md ⭐ (Começa aqui!)
    └─ Guia visual com screenshots
    └─ Cada passo explicado
    └─ Não vai errar

2️⃣  SUPABASE-GUIA.md
    └─ Visão geral / referência
    └─ Conceitos
    └─ Arquitetura

3️⃣  CHECKLIST-SUPABASE-RENDER.md
    └─ Checklist completo
    └─ Verificação final
    └─ Troubleshooting


═══════════════════════════════════════════════════════════════════════════════

⚡ RESUMO RÁPIDO (Se já conhece a plataforma)
────────────────────────────────────────────────────────────────────────────

```bash
# 1. SUPABASE
   Criar projeto em: https://supabase.com
   Copiar DATABASE_URL

# 2. SCHEMA
   SQL Editor → New Query
   Copiar db/schema.sql
   Colar e Run

# 3. SEED
   SQL Editor → New Query
   Copiar db/seed.sql
   Colar e Run

# 4. .env LOCAL
   DATABASE_URL=[supabase_url]

# 5. TESTAR
   npm start
   Verificar se conectou

# 6. GIT PUSH
   git add .
   git commit -m "Setup Supabase"
   git push

# 7. RENDER DEPLOY
   Dashboard Render → New → Web Service
   Conectar GitHub
   Adicionar DATABASE_URL em Environment
   Deploy automático

# 8. ACESSAR
   URL: seu-stockflow.onrender.com
   Login: Administrador / 0000
```


═══════════════════════════════════════════════════════════════════════════════

🎯 ARQUITETURA FINAL
────────────────────────────────────────────────────────────────────────────

Você               Celular           Outro PC
   │                  │                  │
   └──────────────────┼──────────────────┘
                      │
                   Internet
                      │
        ┌─────────────────────────┐
        │ seu-stockflow.render    │ ← Node.js (App)
        │     (Render)            │
        └─────────────────────────┘
                      │
        ┌─────────────────────────┐
        │ Supabase PostgreSQL     │ ← Banco de dados
        │   (Dados)               │
        └─────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════

✅ VERIFICAÇÃO FINAL
────────────────────────────────────────────────────────────────────────────

Tudo pronto quando:

✓ Supabase projeto criado e rodando
✓ Tabelas criadas (schema.sql rodado)
✓ Dados iniciais inseridos (seed.sql rodado)
✓ .env local com DATABASE_URL do Supabase
✓ npm start funciona localmente
✓ Login funciona localmente
✓ Dados aparecem localmente
✓ Código enviado para GitHub
✓ Deploy feito em Render
✓ URL online acessível
✓ Login funciona online
✓ Dados aparecem online


═══════════════════════════════════════════════════════════════════════════════

🔗 LINKS IMPORTANTES
────────────────────────────────────────────────────────────────────────────

Supabase:
  https://supabase.com

Render:
  https://render.com

GitHub Stockflow:
  https://github.com/lab1-create/stockflow


═══════════════════════════════════════════════════════════════════════════════

💡 DICAS
────────────────────────────────────────────────────────────────────────────

✓ Supabase é grátis até 500GB
✓ Render tem plano grátis (com hibernação)
✓ DATABASE_URL nunca compartilhe publicamente
✓ Use variáveis de ambiente para credenciais
✓ Dados no Supabase são persistidos sempre
✓ Primeira deploy demora 5 minutos
✓ Próximas deployments são mais rápidas


═══════════════════════════════════════════════════════════════════════════════

🆘 NÃO FUNCIONA?
────────────────────────────────────────────────────────────────────────────

Consulte: CHECKLIST-SUPABASE-RENDER.md

Seção: Troubleshooting


═══════════════════════════════════════════════════════════════════════════════

🎬 COMECE AGORA!

Passo 1: Abra
  SUPABASE-PASSO-A-PASSO.md

Passo 2: Siga o guia visual

Passo 3: Pronto! Online! 🎉


═══════════════════════════════════════════════════════════════════════════════

Perguntas? Veja:
  SUPABASE-GUIA.md (visão geral)
  CHECKLIST-SUPABASE-RENDER.md (verificação)

═══════════════════════════════════════════════════════════════════════════════
