-- ============================================
-- PIZZA HERO - SUPABASE LEADERBOARD TABLE
-- ============================================
-- Copia todo este código y pégalo en:
-- Supabase → SQL Editor → New Query → Run
-- ============================================

-- Crear tabla de leaderboard
CREATE TABLE leaderboard (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) >= 3 AND char_length(name) <= 15),
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 1000000),
  pizzas INTEGER NOT NULL CHECK (pizzas >= 0),
  grade TEXT NOT NULL CHECK (grade IN ('S', 'A', 'B', 'C', 'D', 'F')),
  accuracy DECIMAL(5,2),
  country TEXT DEFAULT 'XX',
  wallet_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para queries rápidas
CREATE INDEX idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX idx_leaderboard_created_at ON leaderboard(created_at DESC);
CREATE INDEX idx_leaderboard_country ON leaderboard(country);

-- Habilitar Row Level Security
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer el leaderboard
CREATE POLICY "Anyone can read leaderboard"
ON leaderboard FOR SELECT
USING (true);

-- Política: Todos pueden insertar scores
CREATE POLICY "Anyone can insert scores"
ON leaderboard FOR INSERT
WITH CHECK (true);

-- Comentarios para documentación
COMMENT ON TABLE leaderboard IS 'Global leaderboard for Pizza Hero game';
COMMENT ON COLUMN leaderboard.name IS 'Player name (3-15 characters)';
COMMENT ON COLUMN leaderboard.score IS 'Final game score';
COMMENT ON COLUMN leaderboard.pizzas IS 'Number of pizzas completed';
COMMENT ON COLUMN leaderboard.grade IS 'Performance grade (S, A, B, C, D, F)';
COMMENT ON COLUMN leaderboard.accuracy IS 'Hit accuracy percentage';
COMMENT ON COLUMN leaderboard.country IS 'Country code (ISO 3166-1 alpha-2)';
COMMENT ON COLUMN leaderboard.wallet_address IS 'Web3 wallet address for future NFT/token integration';
COMMENT ON COLUMN leaderboard.created_at IS 'Timestamp when score was submitted';
