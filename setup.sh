#!/bin/bash

# =============================================================================
# 🚀 BALAKO DIGITAL CRM - SCRIPT DE SETUP RÁPIDO
# =============================================================================
# Este script automatiza a configuração inicial do projeto
# Execute: chmod +x setup.sh && ./setup.sh
# =============================================================================

set -e  # Para execução ao primeiro erro

echo "🚀 Iniciando setup do Balako Digital CRM..."
echo ""

# =============================================================================
# PASSO 1: Verificar Node.js e npm
# =============================================================================
echo "📦 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale Node.js 18+ antes de continuar."
    exit 1
fi
echo "✅ Node.js $(node -v) encontrado"
echo ""

# =============================================================================
# PASSO 2: Verificar se .env.local existe
# =============================================================================
echo "🔍 Verificando arquivo .env.local..."
if [ ! -f .env.local ]; then
    echo "❌ Arquivo .env.local não encontrado!"
    echo "📝 Copie .env.local.example para .env.local e preencha as credenciais:"
    echo "   cp .env.local .env.local.example"
    echo "   nano .env.local"
    exit 1
fi
echo "✅ Arquivo .env.local encontrado"
echo ""

# =============================================================================
# PASSO 3: Instalar dependências
# =============================================================================
echo "📦 Instalando dependências..."
if command -v pnpm &> /dev/null; then
    echo "📦 Usando pnpm..."
    pnpm install
elif command -v yarn &> /dev/null; then
    echo "📦 Usando yarn..."
    yarn install
else
    echo "📦 Usando npm..."
    npm install
fi
echo "✅ Dependências instaladas"
echo ""

# =============================================================================
# PASSO 4: Gerar Prisma Client
# =============================================================================
echo "🗄️ Gerando Prisma Client..."
npx prisma generate
echo "✅ Prisma Client gerado"
echo ""

# =============================================================================
# PASSO 5: Executar Migrations
# =============================================================================
echo "🗄️ Executando migrations no banco de dados..."
echo "⚠️  Certifique-se de que DATABASE_URL e DIRECT_URL estão corretos no .env.local"
read -p "Deseja continuar? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npx prisma migrate dev --name init_supabase
    echo "✅ Migrations executadas com sucesso"
else
    echo "⏭️  Migrations puladas. Execute manualmente: npx prisma migrate dev"
fi
echo ""

# =============================================================================
# PASSO 6: Seed inicial (opcional)
# =============================================================================
echo "🌱 Deseja popular o banco com dados iniciais? (seed)"
read -p "Continuar? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -f prisma/seeds/seed.ts ]; then
        npx prisma db seed
        echo "✅ Seed executado"
    else
        echo "⚠️  Arquivo de seed não encontrado. Pulando..."
    fi
else
    echo "⏭️  Seed pulado"
fi
echo ""

# =============================================================================
# PASSO 7: Verificar Build
# =============================================================================
echo "🔨 Verificando build do projeto..."
read -p "Deseja fazer build de teste? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run build
    echo "✅ Build concluído com sucesso"
else
    echo "⏭️  Build pulado"
fi
echo ""

# =============================================================================
# FINALIZAÇÃO
# =============================================================================
echo "=========================================="
echo "✅ Setup concluído com sucesso!"
echo "=========================================="
echo ""
echo "📋 Próximos passos:"
echo ""
echo "1️⃣  Iniciar servidor de desenvolvimento:"
echo "   npm run dev"
echo ""
echo "2️⃣  Acessar aplicação:"
echo "   http://localhost:3000"
echo ""
echo "3️⃣  Criar primeiro usuário:"
echo "   - Acesse /register"
echo "   - Crie conta"
echo "   - No Supabase, edite o campo 'role' para 'agency'"
echo ""
echo "4️⃣  Verificar tabelas no Supabase:"
echo "   - Acesse Supabase Dashboard"
echo "   - Table Editor"
echo "   - Confirme: Users, Contacts, Tasks, WhatsAppMessage"
echo ""
echo "📖 Consulte SETUP_GUIDE.md para mais detalhes"
echo ""
echo "🐛 Problemas? Veja troubleshooting em SETUP_GUIDE.md"
echo ""
