BEGIN;

-- Garante que a tabela aceita os pin_codes corretamente
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS pin_code TEXT;
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE;

-- Atualiza/Insere TODOS os usuários (os antigos + o Gabriel) garantindo compatibilidade de PINs
INSERT INTO app_users (name, role, pin_code, active) VALUES
  ('Administrador', 'admin', 'Out@adm', TRUE),
  ('Luiz', 'tecnico', '1111', TRUE),
  ('Bruno', 'tecnico', '1111', TRUE),
  ('Joao', 'tecnico', '1111', TRUE),
  ('Placo', 'tecnico', '1111', TRUE),
  ('Kaique', 'tecnico', '1111', TRUE),
  ('Cauã', 'tecnico', '1111', TRUE),
  ('Gabriel', 'tecnico', '1111', TRUE)
ON CONFLICT (name) DO UPDATE SET
  role = EXCLUDED.role,
  pin_code = EXCLUDED.pin_code,
  active = TRUE;

-- Atualiza a tabela de destinos com as novas bancadas e locais especiais
INSERT INTO destinations (name, active) VALUES
  ('Bancada 01', TRUE),
  ('Bancada 02', TRUE),
  ('Bancada 03', TRUE),
  ('Bancada 04', TRUE),
  ('Bancada 05', TRUE),
  ('Bancada 06', TRUE),
  ('Servico interno', TRUE),
  ('Estoque de testes', TRUE),
  ('Teste', TRUE),
  ('Outro', TRUE)
ON CONFLICT (name) DO UPDATE SET active = TRUE;

COMMIT;
