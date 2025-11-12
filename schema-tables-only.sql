-- ============================================================================
-- CRIAR APENAS AS TABELAS (enums já existem)
-- Execute no Supabase SQL Editor
-- ============================================================================

-- CreateTable
CREATE TABLE IF NOT EXISTS "crm_Accounts" (
    "id" TEXT NOT NULL,
    "v" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" TEXT,
    "annual_revenue" TEXT,
    "assigned_to" TEXT,
    "billing_city" TEXT,
    "billing_country" TEXT,
    "billing_postal_code" TEXT,
    "billing_state" TEXT,
    "billing_street" TEXT,
    "company_id" TEXT,
    "description" TEXT,
    "email" TEXT,
    "employees" TEXT,
    "fax" TEXT,
    "industry" TEXT,
    "member_of" TEXT,
    "name" TEXT NOT NULL,
    "office_phone" TEXT,
    "shipping_city" TEXT,
    "shipping_country" TEXT,
    "shipping_postal_code" TEXT,
    "shipping_state" TEXT,
    "shipping_street" TEXT,
    "status" TEXT DEFAULT 'Inactive',
    "type" TEXT DEFAULT 'Customer',
    "vat" TEXT,
    "website" TEXT,
    "documentsIDs" TEXT[],
    "watchers" TEXT[],

    CONSTRAINT "crm_Accounts_pkey" PRIMARY KEY ("id")
);

-- Continue copiando o resto das tabelas do schema.sql...
-- Mas PULE todas as linhas que começam com "CREATE TYPE"
