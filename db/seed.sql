BEGIN;

-- Garante que as tabelas possuem as colunas corretas
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS pin_code TEXT;
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE;

-- Insere ou atualiza os usuários com o pin_code correto
INSERT INTO app_users (name, role, pin_code, active) VALUES
  ('Administrador', 'admin', '0000', TRUE),
  ('Luiz', 'tecnico', '1111', TRUE),
  ('Bruno', 'tecnico', '1111', TRUE),
  ('Joao', 'tecnico', '1111', TRUE),
  ('Gabriel', 'tecnico', '1111', TRUE)
ON CONFLICT (name) DO UPDATE SET
  role = EXCLUDED.role,
  pin_code = EXCLUDED.pin_code,
  active = TRUE;

-- Garante que a tabela de destinos existe e insere os novos locais
CREATE TABLE IF NOT EXISTS destinations (
  name TEXT PRIMARY KEY
);

INSERT INTO destinations (name) VALUES
  ('Bancada 01'),
  ('Bancada 02'),
  ('Bancada 03'),
  ('Bancada 04'),
  ('Servico interno'),
  ('Estoque de testes'),
  ('Outro'),
  ('Estoque')
ON CONFLICT (name) DO NOTHING;

COMMIT;
