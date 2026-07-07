📊 SUPABASE - QUAIS DADOS ADICIONAR NAS TABELAS
═══════════════════════════════════════════════════════════════════════════════

Após rodar schema.sql, as tabelas estarão VAZIAS.

Você precisa adicionar dados iniciais (seed).

Vamos lá! 📝


═══════════════════════════════════════════════════════════════════════════════

🎯 OPÇÃO 1: USAR ARQUIVO seed.sql (Recomendado)
─────────────────────────────────────────────────────────────────────────────

Mais fácil! Temos arquivo pronto.

1. No Supabase Dashboard:
   - SQL Editor → New Query

2. Abrir arquivo do projeto:
   - db/seed.sql

3. Copiar TODO o conteúdo

4. Colar no SQL Editor do Supabase

5. Clicar: "Run"

6. Pronto! ✅ Dados inseridos

Se não souber onde encontrar seed.sql:
   - Pasta do projeto: stockflow-main/db/seed.sql


═══════════════════════════════════════════════════════════════════════════════

🎯 OPÇÃO 2: ADICIONAR DADOS MANUALMENTE (Se preferir)
─────────────────────────────────────────────────────────────────────────────

Se quiser ver exatamente o que está sendo inserido, siga abaixo:


📋 TABELA 1: app_users (Usuários)
────────────────────────────────────────────────────────────────────────────

Dados a inserir:

1. Administrador (admin)
   ├─ Name: Administrador
   ├─ Role: admin
   ├─ PIN Code: 0000
   └─ Active: true

2. Luiz (tecnico)
   ├─ Name: Luiz
   ├─ Role: tecnico
   ├─ PIN Code: 1111
   └─ Active: true

3. Henrique (tecnico)
   ├─ Name: Henrique
   ├─ Role: tecnico
   ├─ PIN Code: 1111
   └─ Active: true

4. Joao (tecnico)
   ├─ Name: Joao
   ├─ Role: tecnico
   ├─ PIN Code: 1111
   └─ Active: true

5. Gabriel (tecnico)
   ├─ Name: Gabriel
   ├─ Role: tecnico
   ├─ PIN Code: 1111
   └─ Active: true

SQL para adicionar:

```sql
INSERT INTO app_users (name, role, pin_code, active)
VALUES
  ('Administrador', 'admin', '0000', true),
  ('Luiz', 'tecnico', '1111', true),
  ('Henrique', 'tecnico', '1111', true),
  ('Joao', 'tecnico', '1111', true),
  ('Gabriel', 'tecnico', '1111', true);
```


📋 TABELA 2: destinations (Destinos/Bancadas)
────────────────────────────────────────────────────────────────────────────

Dados a inserir:

1. Bancada 01
2. Bancada 02
3. Bancada 03
4. Bancada 04
5. Servico interno
6. Estoque de testes
7. Outro

SQL para adicionar:

```sql
INSERT INTO destinations (name, active)
VALUES
  ('Bancada 01', true),
  ('Bancada 02', true),
  ('Bancada 03', true),
  ('Bancada 04', true),
  ('Servico interno', true),
  ('Estoque de testes', true),
  ('Outro', true);
```


📋 TABELA 3: supplies (Insumos/Produtos)
────────────────────────────────────────────────────────────────────────────

VAZIA no início (você pode adicionar seus próprios produtos depois)

Você pode deixar vazia ou adicionar alguns exemplo:

```sql
INSERT INTO supplies (code, name, category, current_quantity, minimum_quantity, supplier, note)
VALUES
  ('RESISTOR-1K', 'Resistor 1kΩ', 'Eletrônicos', 100, 20, 'Fornecedor A', 'Uso comum'),
  ('CAPACITOR-10U', 'Capacitor 10µF', 'Eletrônicos', 50, 10, 'Fornecedor B', 'Para circuitos'),
  ('LED-VERMELHO', 'LED Vermelho 5mm', 'Eletrônicos', 200, 30, 'Fornecedor A', 'Vermelho claro'),
  ('PARAFUSO-M3', 'Parafuso M3 inox', 'Hardware', 500, 100, 'Fornecedor C', 'Comprimento 10mm'),
  ('FITA-ISOLANTE', 'Fita isolante preta', 'Materiais', 50, 10, 'Fornecedor B', 'Rolo 10m');
```

(Mas é OPCIONAL - você pode começar com vazio)


📋 TABELA 4: stock_movements (Movimentações)
────────────────────────────────────────────────────────────────────────────

VAZIA no início (preenchida à medida que usarem)

Deixe vazia! (Será preenchida quando fizerem retiradas)


📋 TABELA 5: stock_requests (Solicitações)
────────────────────────────────────────────────────────────────────────────

VAZIA no início (preenchida à medida que usarem)

Deixe vazia! (Será preenchida quando fizerem solicitações)


📋 TABELA 6: usage_kpis (Estatísticas)
────────────────────────────────────────────────────────────────────────────

VAZIA no início (preenchida automaticamente)

Deixe vazia! (Será calculada automaticamente)


═══════════════════════════════════════════════════════════════════════════════

🔧 COMO ADICIONAR OS DADOS NO SUPABASE
────────────────────────────────────────────────────────────────────────────

Método 1: SQL Query (Recomendado)
─────────────────────────────────────────────────────────────────────────────

1. Dashboard Supabase:
   - Aba: "SQL Editor"
   - Botão: "+ New Query"

2. Copiar TUDO do seed.sql (ou comandos acima)

3. Colar no editor

4. Clicar: "Run"

5. Ver resultado: "Query executed successfully"


Método 2: Table Editor (Manual)
─────────────────────────────────────────────────────────────────────────────

1. Dashboard Supabase:
   - Aba: "Table Editor"

2. Selecionar tabela: "app_users"

3. Botão: "Insert row"

4. Preencher campos:
   ├─ name: Administrador
   ├─ role: admin
   ├─ pin_code: 0000
   ├─ active: ✓

5. Repetir para cada usuário

(Mais lento, mas dá pra ver em tempo real)


═══════════════════════════════════════════════════════════════════════════════

✅ VERIFICAÇÃO: OS DADOS ESTÃO LÁ?
────────────────────────────────────────────────────────────────────────────

1. Dashboard Supabase:
   - Aba: "Table Editor"

2. Clicar em tabelas:
   - app_users: deve ter 5 linhas (Administrador + 4 técnicos)
   - destinations: deve ter 7 linhas (Bancada 01 até Outro)
   - supplies: pode estar vazio ou com exemplos

3. Se estão lá:
   ✅ Dados inseridos corretamente!


═══════════════════════════════════════════════════════════════════════════════

📊 RESUMO: O QUE FOI INSERIDO
────────────────────────────────────────────────────────────────────────────

OBRIGATÓRIO (seed.sql):
  ✅ 5 usuários (admin + 4 técnicos)
  ✅ 7 destinos/bancadas
  ✅ PIN padrão (0000 admin, 1111 técnico)

OPCIONAL (seed.sql extras):
  ✅ 5 produtos exemplo
  ✅ (Você adiciona seus produtos depois)

DEIXA VAZIO (preenchido automaticamente):
  ✅ stock_movements (histórico de movimentos)
  ✅ stock_requests (solicitações)
  ✅ usage_kpis (estatísticas)


═══════════════════════════════════════════════════════════════════════════════

🚀 PRÓXIMOS PASSOS
────────────────────────────────────────────────────────────────────────────

1. Rodar schema.sql (cria tabelas)
2. Rodar seed.sql (adiciona dados)
3. Verificar se dados estão lá
4. Copiar DATABASE_URL
5. Atualizar .env
6. Testar localmente: npm start
7. Deploy Render
8. Usar online!


═══════════════════════════════════════════════════════════════════════════════

❓ DÚVIDAS FREQUENTES
────────────────────────────────────────────────────────────────────────────

P: Posso adicionar mais usuários?
R: Sim! Adicione em app_users com role='tecnico' ou role='admin'

P: Preciso adicionar produtos agora?
R: Não! Você adiciona depois via interface da aplicação

P: O que é PIN_CODE?
R: É a senha para fazer login. Admin usa 0000, técnico usa 1111

P: Posso trocar o PIN?
R: Sim! Edite no SQL ou Interface do Supabase

P: E se errar ao adicionar dados?
R: Pode deletar a linha no Table Editor e adicionar novamente

P: Histórico vira onde?
R: Na tabela stock_movements (preenchida automaticamente quando usarem)


═══════════════════════════════════════════════════════════════════════════════

✨ PRONTO!

Dados adicionados no Supabase ✅

Próximo passo: Conectar no .env local e fazer deploy!

═══════════════════════════════════════════════════════════════════════════════
