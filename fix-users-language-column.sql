-- ============================================================================
-- ADICIONAR COLUNA userLanguage NA TABELA Users
-- Execute no Supabase SQL Editor
-- ============================================================================

-- Adicionar a coluna userLanguage
ALTER TABLE "Users" 
ADD COLUMN IF NOT EXISTS "userLanguage" "Language" NOT NULL DEFAULT 'pt';

-- Verificar se funcionou
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'Users' 
  AND column_name = 'userLanguage';
