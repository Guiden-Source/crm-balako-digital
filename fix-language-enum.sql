-- ============================================================================
-- FIX: Atualizar todos os usuários com language='en' para 'pt'
-- ============================================================================
-- Este script corrige o problema de enum Language que só aceita 'pt'
-- Execute no Supabase SQL Editor antes do deploy
-- ============================================================================

-- 1. Atualizar todos os usuários com language diferente de 'pt' para 'pt'
UPDATE users 
SET "userLanguage" = 'pt' 
WHERE "userLanguage" IS NULL OR "userLanguage" != 'pt';

-- 2. Verificar se há registros não atualizados
SELECT id, name, email, "userLanguage" 
FROM users 
WHERE "userLanguage" IS NULL OR "userLanguage" != 'pt';

-- 3. Se a query acima retornar 0 registros, está tudo correto!
