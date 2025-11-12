-- CreateEnum
CREATE TYPE "crm_Lead_Status" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'LOST');

-- CreateEnum
CREATE TYPE "crm_Lead_Type" AS ENUM ('DEMO');

-- CreateEnum
CREATE TYPE "crm_Opportunity_Status" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING', 'CLOSED');

-- CreateEnum
CREATE TYPE "crm_Contact_Type" AS ENUM ('Customer', 'Partner', 'Vendor', 'Prospect');

-- CreateEnum
CREATE TYPE "crm_Contracts_Status" AS ENUM ('NOTSTARTED', 'INPROGRESS', 'SIGNED');

-- CreateEnum
CREATE TYPE "DocumentSystemType" AS ENUM ('INVOICE', 'RECEIPT', 'CONTRACT', 'OFFER', 'OTHER');

-- CreateEnum
CREATE TYPE "taskStatus" AS ENUM ('ACTIVE', 'PENDING', 'COMPLETE');

-- CreateEnum
CREATE TYPE "ActiveStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('pt');

-- CreateEnum
CREATE TYPE "gptStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "crm_Accounts" (
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

-- CreateTable
CREATE TABLE "crm_Leads" (
    "id" TEXT NOT NULL,
    "v" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" TEXT,
    "firstName" TEXT,
    "lastName" TEXT NOT NULL,
    "company" TEXT,
    "jobTitle" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "description" TEXT,
    "lead_source" TEXT,
    "refered_by" TEXT,
    "campaign" TEXT,
    "status" TEXT DEFAULT 'NEW',
    "type" TEXT DEFAULT 'DEMO',
    "assigned_to" TEXT,
    "accountsIDs" TEXT,
    "documentsIDs" TEXT[],

    CONSTRAINT "crm_Leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_Opportunities" (
    "id" TEXT NOT NULL,
    "v" INTEGER NOT NULL DEFAULT 0,
    "account" TEXT,
    "assigned_to" TEXT,
    "budget" INTEGER NOT NULL DEFAULT 0,
    "campaign" TEXT,
    "close_date" TIMESTAMP(3),
    "contact" TEXT,
    "created_by" TEXT,
    "createdBy" TEXT,
    "created_on" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_activity" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),
    "updatedBy" TEXT,
    "last_activity_by" TEXT,
    "currency" TEXT,
    "description" TEXT,
    "expected_revenue" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT,
    "next_step" TEXT,
    "sales_stage" TEXT,
    "type" TEXT,
    "status" "crm_Opportunity_Status" DEFAULT 'ACTIVE',
    "connected_documents" TEXT[],
    "connected_contacts" TEXT[],

    CONSTRAINT "crm_Opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_campaigns" (
    "id" TEXT NOT NULL,
    "v" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT,

    CONSTRAINT "crm_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_Opportunities_Sales_Stages" (
    "id" TEXT NOT NULL,
    "v" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "probability" INTEGER,
    "order" INTEGER,

    CONSTRAINT "crm_Opportunities_Sales_Stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_Opportunities_Type" (
    "id" TEXT NOT NULL,
    "v" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER,

    CONSTRAINT "crm_Opportunities_Type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_Contacts" (
    "id" TEXT NOT NULL,
    "v" INTEGER NOT NULL DEFAULT 0,
    "account" TEXT,
    "assigned_to" TEXT,
    "birthday" TEXT,
    "created_by" TEXT,
    "createdBy" TEXT,
    "created_on" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "cratedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "last_activity" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" TEXT,
    "last_activity_by" TEXT,
    "description" TEXT,
    "email" TEXT,
    "personal_email" TEXT,
    "first_name" TEXT,
    "last_name" TEXT NOT NULL,
    "office_phone" TEXT,
    "mobile_phone" TEXT,
    "website" TEXT,
    "position" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "social_twitter" TEXT,
    "social_facebook" TEXT,
    "social_linkedin" TEXT,
    "social_skype" TEXT,
    "social_instagram" TEXT,
    "social_youtube" TEXT,
    "social_tiktok" TEXT,
    "type" TEXT DEFAULT 'Customer',
    "tags" TEXT[],
    "notes" TEXT[],
    "opportunitiesIDs" TEXT[],
    "accountsIDs" TEXT,
    "documentsIDs" TEXT[],

    CONSTRAINT "crm_Contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_Contracts" (
    "id" TEXT NOT NULL,
    "v" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "renewalReminderDate" TIMESTAMP(3),
    "customerSignedDate" TIMESTAMP(3),
    "companySignedDate" TIMESTAMP(3),
    "description" TEXT,
    "account" TEXT,
    "assigned_to" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" TEXT,
    "status" "crm_Contracts_Status" NOT NULL DEFAULT 'NOTSTARTED',
    "type" TEXT,

    CONSTRAINT "crm_Contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Boards" (
    "id" TEXT NOT NULL,
    "v" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "favourite" BOOLEAN,
    "favouritePosition" INTEGER,
    "icon" TEXT,
    "position" INTEGER,
    "title" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "visibility" TEXT,
    "sharedWith" TEXT[],
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" TEXT,
    "watchers" TEXT[],

    CONSTRAINT "Boards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employees" (
    "id" TEXT NOT NULL,
    "v" INTEGER NOT NULL,
    "avatar" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT NOT NULL,
    "salary" INTEGER NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageUpload" (
    "id" TEXT NOT NULL,

    CONSTRAINT "ImageUpload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MyAccount" (
    "id" TEXT NOT NULL,
    "v" INTEGER NOT NULL,
    "company_name" TEXT NOT NULL,
    "is_person" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT,
    "email_accountant" TEXT,
    "phone_prefix" TEXT,
    "phone" TEXT,
    "mobile_prefix" TEXT,
    "mobile" TEXT,
    "fax_prefix" TEXT,
    "fax" TEXT,
    "website" TEXT,
    "street" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "country" TEXT,
    "country_code" TEXT,
    "billing_street" TEXT,
    "billing_city" TEXT,
    "billing_state" TEXT,
    "billing_zip" TEXT,
    "billing_country" TEXT,
    "billing_country_code" TEXT,
    "currency" TEXT,
    "currency_symbol" TEXT,
    "VAT_number" TEXT NOT NULL,
    "TAX_number" TEXT,
    "bank_name" TEXT,
    "bank_account" TEXT,
    "bank_code" TEXT,
    "bank_IBAN" TEXT,
    "bank_SWIFT" TEXT,

    CONSTRAINT "MyAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoices" (
    "id" TEXT NOT NULL,
    "v" INTEGER,
    "date_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated" TIMESTAMP(3) NOT NULL,
    "last_updated_by" TEXT,
    "date_received" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "date_of_case" TIMESTAMP(3),
    "date_tax" TIMESTAMP(3),
    "date_due" TIMESTAMP(3),
    "description" TEXT,
    "document_type" TEXT,
    "favorite" BOOLEAN DEFAULT false,
    "variable_symbol" TEXT,
    "constant_symbol" TEXT,
    "specific_symbol" TEXT,
    "order_number" TEXT,
    "internal_number" TEXT,
    "invoice_number" TEXT,
    "invoice_amount" TEXT,
    "invoice_file_mimeType" TEXT NOT NULL,
    "invoice_file_url" TEXT NOT NULL,
    "invoice_items" JSONB,
    "invoice_type" TEXT,
    "invoice_currency" TEXT,
    "invoice_language" TEXT,
    "partner" TEXT,
    "partner_street" TEXT,
    "partner_city" TEXT,
    "partner_zip" TEXT,
    "partner_country" TEXT,
    "partner_country_code" TEXT,
    "partner_business_street" TEXT,
    "partner_business_city" TEXT,
    "partner_business_zip" TEXT,
    "partner_business_country" TEXT,
    "partner_business_country_code" TEXT,
    "partner_VAT_number" TEXT,
    "partner_TAX_number" TEXT,
    "partner_TAX_local_number" TEXT,
    "partner_phone_prefix" TEXT,
    "partner_phone_number" TEXT,
    "partner_fax_prefix" TEXT,
    "partner_fax_number" TEXT,
    "partner_email" TEXT,
    "partner_website" TEXT,
    "partner_is_person" BOOLEAN,
    "partner_bank" TEXT,
    "partner_account_number" TEXT,
    "partner_account_bank_number" TEXT,
    "partner_IBAN" TEXT,
    "partner_SWIFT" TEXT,
    "partner_BIC" TEXT,
    "rossum_status" TEXT,
    "rossum_annotation_id" TEXT,
    "rossum_annotation_url" TEXT,
    "rossum_document_id" TEXT,
    "rossum_document_url" TEXT,
    "rossum_annotation_json_url" TEXT,
    "rossum_annotation_xml_url" TEXT,
    "money_s3_url" TEXT,
    "status" TEXT,
    "invoice_state_id" TEXT,
    "assigned_user_id" TEXT,
    "assigned_account_id" TEXT,
    "visibility" BOOLEAN NOT NULL DEFAULT true,
    "connected_documents" TEXT[],

    CONSTRAINT "Invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_States" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "invoice_States_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Documents" (
    "id" TEXT NOT NULL,
    "v" INTEGER,
    "date_created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "last_updated" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),
    "document_name" TEXT NOT NULL,
    "created_by_user" TEXT,
    "createdBy" TEXT,
    "description" TEXT,
    "document_type" TEXT,
    "favourite" BOOLEAN,
    "document_file_mimeType" TEXT NOT NULL,
    "document_file_url" TEXT NOT NULL,
    "status" TEXT,
    "visibility" TEXT,
    "tags" JSONB,
    "key" TEXT,
    "size" INTEGER,
    "assigned_user" TEXT,
    "connected_documents" TEXT[],
    "invoiceIDs" TEXT[],
    "opportunityIDs" TEXT[],
    "contactsIDs" TEXT[],
    "tasksIDs" TEXT[],
    "crm_accounts_tasksIDs" TEXT[],
    "leadsIDs" TEXT[],
    "accountsIDs" TEXT[],
    "document_system_type" "DocumentSystemType" DEFAULT 'OTHER',

    CONSTRAINT "Documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Documents_Types" (
    "id" TEXT NOT NULL,
    "v" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Documents_Types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sections" (
    "id" TEXT NOT NULL,
    "v" INTEGER NOT NULL,
    "board" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER,

    CONSTRAINT "Sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_Industry_Type" (
    "id" TEXT NOT NULL,
    "v" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "crm_Industry_Type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modulStatus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isVisible" BOOLEAN NOT NULL,

    CONSTRAINT "modulStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tasks" (
    "id" TEXT NOT NULL,
    "v" INTEGER NOT NULL,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" TEXT,
    "dueDateAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "lastEditedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "position" INTEGER NOT NULL,
    "priority" TEXT NOT NULL,
    "section" TEXT,
    "tags" JSONB,
    "title" TEXT NOT NULL,
    "likes" INTEGER DEFAULT 0,
    "user" TEXT,
    "documentIDs" TEXT[],
    "notificationSent" BOOLEAN NOT NULL DEFAULT false,
    "notifyViaWhatsApp" BOOLEAN NOT NULL DEFAULT false,
    "notifyViaEmail" BOOLEAN NOT NULL DEFAULT false,
    "taskStatus" "taskStatus" DEFAULT 'ACTIVE',

    CONSTRAINT "Tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_Accounts_Tasks" (
    "id" TEXT NOT NULL,
    "v" INTEGER NOT NULL,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" TEXT,
    "dueDateAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "priority" TEXT NOT NULL,
    "tags" JSONB,
    "title" TEXT NOT NULL,
    "likes" INTEGER DEFAULT 0,
    "user" TEXT,
    "account" TEXT,
    "taskStatus" "taskStatus" DEFAULT 'ACTIVE',

    CONSTRAINT "crm_Accounts_Tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasksComments" (
    "id" TEXT NOT NULL,
    "v" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "task" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "assigned_crm_account_task" TEXT,

    CONSTRAINT "tasksComments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TodoList" (
    "id" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "user" TEXT NOT NULL,

    CONSTRAINT "TodoList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "v" INTEGER NOT NULL DEFAULT 0,
    "account_name" TEXT,
    "avatar" TEXT,
    "email" TEXT NOT NULL,
    "is_account_admin" BOOLEAN NOT NULL DEFAULT false,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" TIMESTAMP(3),
    "name" TEXT,
    "password" TEXT,
    "username" TEXT,
    "role" TEXT NOT NULL DEFAULT 'client',
    "userStatus" "ActiveStatus" NOT NULL DEFAULT 'PENDING',
    "userLanguage" "Language" NOT NULL DEFAULT 'pt',
    "watching_boardsIDs" TEXT[],
    "watching_accountsIDs" TEXT[],

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_Modules_Enabled" (
    "id" TEXT NOT NULL,
    "v" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "system_Modules_Enabled_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "secondBrain_notions" (
    "id" TEXT NOT NULL,
    "v" INTEGER NOT NULL,
    "user" TEXT NOT NULL,
    "notion_api_key" TEXT NOT NULL,
    "notion_db_id" TEXT NOT NULL,

    CONSTRAINT "secondBrain_notions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "openAi_keys" (
    "id" TEXT NOT NULL,
    "v" INTEGER NOT NULL,
    "user" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,

    CONSTRAINT "openAi_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "systemServices" (
    "id" TEXT NOT NULL,
    "v" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "serviceUrl" TEXT,
    "serviceId" TEXT,
    "serviceKey" TEXT,
    "servicePassword" TEXT,
    "servicePort" TEXT,
    "description" TEXT,

    CONSTRAINT "systemServices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gpt_models" (
    "id" TEXT NOT NULL,
    "v" INTEGER NOT NULL,
    "model" TEXT NOT NULL,
    "description" TEXT,
    "status" "gptStatus",
    "created_on" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gpt_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhatsAppMessage" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "sentBy" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhatsAppMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhatsAppConfig" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "evolutionApiUrl" TEXT NOT NULL,
    "evolutionApiKey" TEXT NOT NULL,
    "instanceName" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DISCONNECTED',
    "qrCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsAppConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_crm_ContactsTocrm_Opportunities" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_watching_users" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DocumentsToInvoices" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DocumentsTocrm_Opportunities" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DocumentsTocrm_Contacts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DocumentsToTasks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DocumentsTocrm_Leads" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DocumentsTocrm_Accounts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_watching_accounts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "WhatsAppConfig_userId_key" ON "WhatsAppConfig"("userId");

-- CreateIndex
CREATE INDEX "WhatsAppConfig_userId_idx" ON "WhatsAppConfig"("userId");

-- CreateIndex
CREATE INDEX "WhatsAppConfig_status_idx" ON "WhatsAppConfig"("status");

-- CreateIndex
CREATE UNIQUE INDEX "_crm_ContactsTocrm_Opportunities_AB_unique" ON "_crm_ContactsTocrm_Opportunities"("A", "B");

-- CreateIndex
CREATE INDEX "_crm_ContactsTocrm_Opportunities_B_index" ON "_crm_ContactsTocrm_Opportunities"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_watching_users_AB_unique" ON "_watching_users"("A", "B");

-- CreateIndex
CREATE INDEX "_watching_users_B_index" ON "_watching_users"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DocumentsToInvoices_AB_unique" ON "_DocumentsToInvoices"("A", "B");

-- CreateIndex
CREATE INDEX "_DocumentsToInvoices_B_index" ON "_DocumentsToInvoices"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DocumentsTocrm_Opportunities_AB_unique" ON "_DocumentsTocrm_Opportunities"("A", "B");

-- CreateIndex
CREATE INDEX "_DocumentsTocrm_Opportunities_B_index" ON "_DocumentsTocrm_Opportunities"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DocumentsTocrm_Contacts_AB_unique" ON "_DocumentsTocrm_Contacts"("A", "B");

-- CreateIndex
CREATE INDEX "_DocumentsTocrm_Contacts_B_index" ON "_DocumentsTocrm_Contacts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DocumentsToTasks_AB_unique" ON "_DocumentsToTasks"("A", "B");

-- CreateIndex
CREATE INDEX "_DocumentsToTasks_B_index" ON "_DocumentsToTasks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DocumentsTocrm_Leads_AB_unique" ON "_DocumentsTocrm_Leads"("A", "B");

-- CreateIndex
CREATE INDEX "_DocumentsTocrm_Leads_B_index" ON "_DocumentsTocrm_Leads"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DocumentsTocrm_Accounts_AB_unique" ON "_DocumentsTocrm_Accounts"("A", "B");

-- CreateIndex
CREATE INDEX "_DocumentsTocrm_Accounts_B_index" ON "_DocumentsTocrm_Accounts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_watching_accounts_AB_unique" ON "_watching_accounts"("A", "B");

-- CreateIndex
CREATE INDEX "_watching_accounts_B_index" ON "_watching_accounts"("B");

-- AddForeignKey
ALTER TABLE "crm_Accounts" ADD CONSTRAINT "crm_Accounts_industry_fkey" FOREIGN KEY ("industry") REFERENCES "crm_Industry_Type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_Accounts" ADD CONSTRAINT "crm_Accounts_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_Leads" ADD CONSTRAINT "crm_Leads_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_Leads" ADD CONSTRAINT "crm_Leads_accountsIDs_fkey" FOREIGN KEY ("accountsIDs") REFERENCES "crm_Accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_Opportunities" ADD CONSTRAINT "crm_Opportunities_type_fkey" FOREIGN KEY ("type") REFERENCES "crm_Opportunities_Type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_Opportunities" ADD CONSTRAINT "crm_Opportunities_sales_stage_fkey" FOREIGN KEY ("sales_stage") REFERENCES "crm_Opportunities_Sales_Stages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_Opportunities" ADD CONSTRAINT "crm_Opportunities_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_Opportunities" ADD CONSTRAINT "crm_Opportunities_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_Opportunities" ADD CONSTRAINT "crm_Opportunities_account_fkey" FOREIGN KEY ("account") REFERENCES "crm_Accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_Opportunities" ADD CONSTRAINT "crm_Opportunities_campaign_fkey" FOREIGN KEY ("campaign") REFERENCES "crm_campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_Contacts" ADD CONSTRAINT "crm_Contacts_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_Contacts" ADD CONSTRAINT "crm_Contacts_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_Contacts" ADD CONSTRAINT "crm_Contacts_accountsIDs_fkey" FOREIGN KEY ("accountsIDs") REFERENCES "crm_Accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_Contracts" ADD CONSTRAINT "crm_Contracts_account_fkey" FOREIGN KEY ("account") REFERENCES "crm_Accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_Contracts" ADD CONSTRAINT "crm_Contracts_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boards" ADD CONSTRAINT "Boards_user_fkey" FOREIGN KEY ("user") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoices" ADD CONSTRAINT "Invoices_invoice_state_id_fkey" FOREIGN KEY ("invoice_state_id") REFERENCES "invoice_States"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoices" ADD CONSTRAINT "Invoices_assigned_user_id_fkey" FOREIGN KEY ("assigned_user_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoices" ADD CONSTRAINT "Invoices_assigned_account_id_fkey" FOREIGN KEY ("assigned_account_id") REFERENCES "crm_Accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_created_by_user_fkey" FOREIGN KEY ("created_by_user") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_assigned_user_fkey" FOREIGN KEY ("assigned_user") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_document_type_fkey" FOREIGN KEY ("document_type") REFERENCES "Documents_Types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_user_fkey" FOREIGN KEY ("user") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_section_fkey" FOREIGN KEY ("section") REFERENCES "Sections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_Accounts_Tasks" ADD CONSTRAINT "crm_Accounts_Tasks_user_fkey" FOREIGN KEY ("user") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_Accounts_Tasks" ADD CONSTRAINT "crm_Accounts_Tasks_account_fkey" FOREIGN KEY ("account") REFERENCES "crm_Accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasksComments" ADD CONSTRAINT "tasksComments_assigned_crm_account_task_fkey" FOREIGN KEY ("assigned_crm_account_task") REFERENCES "crm_Accounts_Tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasksComments" ADD CONSTRAINT "tasksComments_task_fkey" FOREIGN KEY ("task") REFERENCES "Tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasksComments" ADD CONSTRAINT "tasksComments_user_fkey" FOREIGN KEY ("user") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "secondBrain_notions" ADD CONSTRAINT "secondBrain_notions_user_fkey" FOREIGN KEY ("user") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "openAi_keys" ADD CONSTRAINT "openAi_keys_user_fkey" FOREIGN KEY ("user") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppMessage" ADD CONSTRAINT "WhatsAppMessage_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "crm_Contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppMessage" ADD CONSTRAINT "WhatsAppMessage_sentBy_fkey" FOREIGN KEY ("sentBy") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppConfig" ADD CONSTRAINT "WhatsAppConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_crm_ContactsTocrm_Opportunities" ADD CONSTRAINT "_crm_ContactsTocrm_Opportunities_A_fkey" FOREIGN KEY ("A") REFERENCES "crm_Contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_crm_ContactsTocrm_Opportunities" ADD CONSTRAINT "_crm_ContactsTocrm_Opportunities_B_fkey" FOREIGN KEY ("B") REFERENCES "crm_Opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_watching_users" ADD CONSTRAINT "_watching_users_A_fkey" FOREIGN KEY ("A") REFERENCES "Boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_watching_users" ADD CONSTRAINT "_watching_users_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentsToInvoices" ADD CONSTRAINT "_DocumentsToInvoices_A_fkey" FOREIGN KEY ("A") REFERENCES "Documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentsToInvoices" ADD CONSTRAINT "_DocumentsToInvoices_B_fkey" FOREIGN KEY ("B") REFERENCES "Invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentsTocrm_Opportunities" ADD CONSTRAINT "_DocumentsTocrm_Opportunities_A_fkey" FOREIGN KEY ("A") REFERENCES "Documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentsTocrm_Opportunities" ADD CONSTRAINT "_DocumentsTocrm_Opportunities_B_fkey" FOREIGN KEY ("B") REFERENCES "crm_Opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentsTocrm_Contacts" ADD CONSTRAINT "_DocumentsTocrm_Contacts_A_fkey" FOREIGN KEY ("A") REFERENCES "Documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentsTocrm_Contacts" ADD CONSTRAINT "_DocumentsTocrm_Contacts_B_fkey" FOREIGN KEY ("B") REFERENCES "crm_Contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentsToTasks" ADD CONSTRAINT "_DocumentsToTasks_A_fkey" FOREIGN KEY ("A") REFERENCES "Documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentsToTasks" ADD CONSTRAINT "_DocumentsToTasks_B_fkey" FOREIGN KEY ("B") REFERENCES "Tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentsTocrm_Leads" ADD CONSTRAINT "_DocumentsTocrm_Leads_A_fkey" FOREIGN KEY ("A") REFERENCES "Documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentsTocrm_Leads" ADD CONSTRAINT "_DocumentsTocrm_Leads_B_fkey" FOREIGN KEY ("B") REFERENCES "crm_Leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentsTocrm_Accounts" ADD CONSTRAINT "_DocumentsTocrm_Accounts_A_fkey" FOREIGN KEY ("A") REFERENCES "Documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentsTocrm_Accounts" ADD CONSTRAINT "_DocumentsTocrm_Accounts_B_fkey" FOREIGN KEY ("B") REFERENCES "crm_Accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_watching_accounts" ADD CONSTRAINT "_watching_accounts_A_fkey" FOREIGN KEY ("A") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_watching_accounts" ADD CONSTRAINT "_watching_accounts_B_fkey" FOREIGN KEY ("B") REFERENCES "crm_Accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

