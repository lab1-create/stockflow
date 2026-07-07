⚡ SUPABASE - GUIA RÁPIDO DE DADOS
═══════════════════════════════════════════════════════════════════════════════

🎯 RESUMO: QUAIS DADOS VOCÊ PRECISA ADICIONAR

═══════════════════════════════════════════════════════════════════════════════

📋 DADOS OBRIGATÓRIOS (Use o seed.sql)
─────────────────────────────────────────────────────────────────────────────

Tabela: app_users (Usuários do Sistema)
┌──────────────────┬────────┬─────────┐
│ Nome             │ Role   │ PIN     │
├──────────────────┼────────┼─────────┤
│ Administrador    │ admin  │ 0000    │
│ Luiz             │ tecnico│ 1111    │
│ Henrique         │ tecnico│ 1111    │
│ Joao             │ tecnico│ 1111    │
│ Gabriel          │ tecnico│ 1111    │
└──────────────────┴────────┴─────────┘


Tabela: destinations (Destinos/Bancadas)
┌─────────────────────┐
│ Nome                │
├─────────────────────┤
│ Bancada 01          │
│ Bancada 02          │
│ Bancada 03          │
│ Bancada 04          │
│ Servico interno     │
│ Estoque de testes   │
│ Outro               │
└─────────────────────┘


═══════════════════════════════════════════════════════════════════════════════

📦 DADOS OPCIONAIS (Você adiciona depois)
─────────────────────────────────────────────────────────────────────────────

Tabela: supplies (Produtos/Insumos)
  ❌ DEIXE VAZIO no início
  ✅ Você adiciona seus produtos via interface depois
  ✅ Ou manualmente via SQL

  Exemplo:
  - Resistor 1kΩ
  - Capacitor 10µF
  - LED Vermelho
  - Parafuso M3
  - Fita isolante


═══════════════════════════════════════════════════════════════════════════════

📊 DADOS AUTOMÁTICOS (Não precisa adicionar)
─────────────────────────────────────────────────────────────────────────────

Tabelas VAZIAS inicialmente (preenchidas automaticamente):
  - stock_movements (histórico de movimentos)
  - stock_requests (solicitações de retirada)
  - usage_kpis (estatísticas de uso)

Essas tabelas são preenchidas:
  ✓ Quando alguém faz retirada
  ✓ Quando alguém devolve insumo
  ✓ Quando admin aprova solicitação
  ✓ Automaticamente pelo sistema


═══════════════════════════════════════════════════════════════════════════════

🚀 COMO ADICIONAR OS DADOS NO SUPABASE
─────────────────────────────────────────────────────────────────────────────

OPÇÃO 1: SQL Query (Mais Rápido)
────────────────────────────────────────────────────────────────────────────

1. Abrir Supabase Dashboard
2. Aba: "SQL Editor"
3. New Query
4. Copiar TODO o conteúdo de: db/seed.sql
5. Colar no SQL Editor
6. Clicar: "Run" (triângulo azul)
7. Pronto! Dados inseridos ✅


OPÇÃO 2: Table Editor (Manual)
────────────────────────────────────────────────────────────────────────────

1. Abrir Supabase Dashboard
2. Aba: "Table Editor"
3. Selecionar tabela: "app_users"
4. Botão: "Insert row"
5. Preencher:
   - name: Administrador
   - role: admin
   - pin_code: 0000
   - active: true (checkbox)
6. Repetir para cada usuário
7. Fazer o mesmo com "destinations"


OPÇÃO 3: Importar SQL File
────────────────────────────────────────────────────────────────────────────

Alguns clientes de database permitem:
1. psql ou DBeaver
2. Conectar ao Supabase
3. Execute: psql < db/seed.sql


═══════════════════════════════════════════════════════════════════════════════

✅ VERIFICAÇÃO: DADOS ESTÃO INSERIDOS?
─────────────────────────────────────────────────────────────────────────────

1. Supabase Dashboard
2. Aba: "Table Editor"
3. Ver tabelas:

app_users:
  ✓ 5 linhas (Administrador + 4 técnicos)
  
destinations:
  ✓ 7 linhas (Bancada 01 até Outro)

supplies:
  ✓ Vazio (ou com seus produtos)

Se está assim: ✅ DADOS CORRETOS!


═══════════════════════════════════════════════════════════════════════════════

🆘 ERROS COMUNS
─────────────────────────────────────────────────────────────────────────────

❌ "Error: duplicate key value violates unique constraint"
   → Um nome de usuário já existe
   → Solução: Deletar linha e adicionar novamente com nome diferente

❌ "Error: insert or update on table violates foreign key constraint"
   → Referência não existe em outra tabela
   → Solução: Adicionar dados em ordem (users → destinations → supplies)

❌ "Table doesn't exist"
   → Schema.sql não foi rodado
   → Solução: Voltar e executar schema.sql primeiro

❌ "No rows affected"
   → Query rodou mas sem dados
   → Verifique se copipastou corretamente


═══════════════════════════════════════════════════════════════════════════════

📖 PARA MAIS DETALHES
─────────────────────────────────────────────────────────────────────────────

Veja: SUPABASE-DADOS-A-ADICIONAR.md

(Guia completo com SQL pronto para copiar)


═══════════════════════════════════════════════════════════════════════════════

✨ PRÓXIMOS PASSOS
─────────────────────────────────────────────────────────────────────────────

1. ✅ Rodar schema.sql (criar tabelas)
2. ✅ Rodar seed.sql (adicionar dados)
3. ✅ Verificar dados no Table Editor
4. ⏳ Copiar DATABASE_URL
5. ⏳ Atualizar .env local
6. ⏳ Testar: npm start
7. ⏳ Deploy Render
8. ⏳ Usar online!


═══════════════════════════════════════════════════════════════════════════════

🎉 Dados Adicionados? Vá para SUPABASE-PASSO-A-PASSO.md

Próximo passo: Conectar DATABASE_URL ao .env local

═══════════════════════════════════════════════════════════════════════════════
