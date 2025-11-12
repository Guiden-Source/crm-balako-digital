# 🚀 INÍCIO RÁPIDO - Balako Digital CRM

## ⚡ Setup Rápido (5 minutos)

### 1️⃣ Pré-requisitos
- Node.js 18+
- npm/pnpm/yarn
- Conta Supabase (gratuita)

### 2️⃣ Configurar Supabase

```bash
# 1. Acesse e crie projeto
https://database.new

# 2. Nome do projeto: balako-crm
# 3. Região: South America (São Paulo)
# 4. Copie as credenciais de conexão
```

### 3️⃣ Configurar Ambiente

```bash
# 1. Gerar secrets
openssl rand -base64 32  # Para NEXTAUTH_SECRET
openssl rand -hex 32     # Para CRON_SECRET

# 2. Preencher .env.local com:
# - DATABASE_URL (porta 6543)
# - DIRECT_URL (porta 5432)
# - NEXTAUTH_SECRET (gerado acima)
# - CRON_SECRET (gerado acima)
```

### 4️⃣ Instalar e Rodar

```bash
# Opção A: Script Automático (recomendado)
./setup.sh

# Opção B: Manual
npm install
npx prisma generate
npx prisma migrate dev --name init_supabase
npm run dev
```

### 5️⃣ Acessar

```bash
# Abra no navegador
http://localhost:3000

# Crie sua conta e começe a usar!
```

---

## 📚 Documentação Completa

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Guia detalhado de configuração
- **[CHECKLIST.md](./CHECKLIST.md)** - Checklist interativo de progresso
- **[INSTALL_RESEND.md](./INSTALL_RESEND.md)** - Configurar envio de emails

---

## 🆘 Problemas Comuns

### Erro: "Prisma Client is not configured"
```bash
npx prisma generate
```

### Erro: "Cannot find module..."
```bash
npm install
```

### Erro: "Database connection failed"
Verifique .env.local:
- DATABASE_URL está correto?
- Senha correta?
- Região correta (sa-east-1)?

---

## 🎯 Funcionalidades

✅ **Dashboard Intuitivo** - Visão geral do negócio  
✅ **Gestão de Contatos** - CRM completo  
✅ **Follow-ups Automáticos** - Tasks com notificações  
✅ **WhatsApp Integrado** - Envio automático de mensagens  
✅ **Multi-usuário** - Roles (Agência vs Cliente)  
✅ **Notificações** - Email + WhatsApp  

---

## 🔐 Usuários e Roles

### Agency (Agência)
- Acesso total ao sistema
- Vê todos os contatos e tasks
- Pode criar/editar/deletar tudo

### Client (Cliente)
- Acesso limitado
- Vê apenas seus próprios dados
- Não pode deletar

---

## 📖 Estrutura do Projeto

```
nextcrm-app/
├── app/                    # Next.js 14 App Router
│   ├── [locale]/          # Internacionalização
│   │   └── (routes)/      # Rotas da aplicação
│   └── api/               # API Routes
├── actions/               # Server Actions
├── components/            # Componentes React
├── lib/                   # Bibliotecas e utilitários
│   ├── auth.ts           # NextAuth config
│   ├── email.ts          # Resend integration
│   ├── whatsapp.ts       # Evolution API
│   └── prisma.ts         # Prisma Client
├── locales/              # Traduções (en, cz, de, uk)
├── prisma/               # Database schema
└── public/               # Assets estáticos
```

---

## 🚀 Deploy em Produção

### Vercel (Recomendado)

```bash
# 1. Push para GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Conectar no Vercel
# - Vá em vercel.com
# - Import repository
# - Configure environment variables
# - Deploy!
```

### Variáveis de Ambiente no Vercel

Adicione todas as variáveis do `.env.local`:
- DATABASE_URL
- DIRECT_URL
- NEXTAUTH_URL (mude para seu domínio)
- NEXTAUTH_SECRET
- RESEND_API_KEY
- EVOLUTION_API_URL
- EVOLUTION_API_KEY
- EVOLUTION_INSTANCE_NAME
- CRON_SECRET

---

## 📱 WhatsApp (Evolution API)

### Opção 1: Local (Teste)
```bash
git clone https://github.com/EvolutionAPI/evolution-api.git
cd evolution-api
cp .env.example .env
docker-compose up -d
```

### Opção 2: VPS (Produção)
- Contrate VPS (Hostinger/Contabo/Hetzner)
- Instale Docker
- Configure domínio + SSL
- Instale Evolution API

---

## 🤝 Contribuindo

Encontrou um bug? Tem uma sugestão?
Abra uma issue ou envie um pull request!

---

## 📄 Licença

MIT License - veja [LICENSE](./LICENSE)

---

## 💡 Dicas

💡 Use CHECKLIST.md para acompanhar progresso  
💡 Consulte SETUP_GUIDE.md se tiver dúvidas  
💡 Mantenha .env.local seguro (nunca commite)  
💡 Rotacione secrets periodicamente  

---

**Feito com ❤️ por Balako Digital**
