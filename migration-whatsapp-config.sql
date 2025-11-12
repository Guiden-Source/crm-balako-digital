-- Migration: Add WhatsAppConfig table for multi-tenant WhatsApp support
-- Date: 2025-11-12

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

-- CreateIndex
CREATE UNIQUE INDEX "WhatsAppConfig_userId_key" ON "WhatsAppConfig"("userId");

-- CreateIndex
CREATE INDEX "WhatsAppConfig_userId_idx" ON "WhatsAppConfig"("userId");

-- CreateIndex
CREATE INDEX "WhatsAppConfig_status_idx" ON "WhatsAppConfig"("status");

-- AddForeignKey
ALTER TABLE "WhatsAppConfig" ADD CONSTRAINT "WhatsAppConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
