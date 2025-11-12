-- ============================================================================
-- SETUP COMPLETO DO BANCO DE DADOS - BALAKO DIGITAL CRM
-- ============================================================================
-- Execute este script NO SUPABASE SQL EDITOR para criar todas as tabelas
-- Acesse: https://supabase.com/dashboard/project/jcrnbtzkkuxpbasfzlwx/editor
-- ============================================================================

-- IMPORTANTE: Execute TUDO de uma vez no SQL Editor do Supabase

-- ============================================================================
-- PARTE 1: CRIAR ENUMS
-- ============================================================================

DO $$ 
BEGIN
    -- Verificar e criar enums se não existirem
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'crm_Lead_Status') THEN
        CREATE TYPE "crm_Lead_Status" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'LOST');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'crm_Lead_Type') THEN
        CREATE TYPE "crm_Lead_Type" AS ENUM ('DEMO');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'crm_Opportunity_Status') THEN
        CREATE TYPE "crm_Opportunity_Status" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING', 'CLOSED');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'crm_Contact_Type') THEN
        CREATE TYPE "crm_Contact_Type" AS ENUM ('Customer', 'Partner', 'Vendor', 'Prospect');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'crm_Contracts_Status') THEN
        CREATE TYPE "crm_Contracts_Status" AS ENUM ('NOTSTARTED', 'INPROGRESS', 'SIGNED');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'DocumentSystemType') THEN
        CREATE TYPE "DocumentSystemType" AS ENUM ('INVOICE', 'RECEIPT', 'CONTRACT', 'OFFER', 'OTHER');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'taskStatus') THEN
        CREATE TYPE "taskStatus" AS ENUM ('ACTIVE', 'PENDING', 'COMPLETE');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ActiveStatus') THEN
        CREATE TYPE "ActiveStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');
    END IF;

    -- IMPORTANTE: Language só com 'pt'
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Language') THEN
        CREATE TYPE "Language" AS ENUM ('pt');
    ELSE
        -- Se já existe com valores antigos, recriar
        DROP TYPE IF EXISTS "Language" CASCADE;
        CREATE TYPE "Language" AS ENUM ('pt');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gptStatus') THEN
        CREATE TYPE "gptStatus" AS ENUM ('ACTIVE', 'INACTIVE');
    END IF;
END $$;

-- ============================================================================
-- VERIFICAÇÃO: Mostrar enums criados
-- ============================================================================
SELECT typname, enumlabel 
FROM pg_type 
JOIN pg_enum ON pg_enum.enumtypid = pg_type.oid 
WHERE typname IN ('Language', 'ActiveStatus', 'taskStatus')
ORDER BY typname, enumlabel;

-- ============================================================================
-- INSTRUÇÕES
-- ============================================================================
-- 
-- DEPOIS de executar este script:
-- 
-- 1. Volte ao terminal e execute:
--    npx prisma db push --accept-data-loss
-- 
-- 2. Isso criará todas as tabelas do schema.prisma
-- 
-- 3. Depois execute:
--    npx prisma db seed
-- 
-- 4. Pronto! Seu banco estará configurado
-- 
-- ============================================================================
