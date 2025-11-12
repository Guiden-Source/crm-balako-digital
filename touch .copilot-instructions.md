# CONTEXTO DO PROJETO - CRM BALAKO DIGITAL

Você é um desenvolvedor sênior especializado em Next.js 14+, TypeScript, Tailwind CSS, Supabase e integração com APIs externas. Vamos adaptar o projeto NextCRM (https://github.com/pdovhomilja/nextcrm-app) para criar o **CRM Balako Digital** - um CRM focado em agências que gerenciam múltiplos clientes.

---

## 📌 OBJETIVO DO PROJETO

Criar um MVP de CRM onde:
- **Agências** gerenciam contatos, tarefas e follow-ups de múltiplos clientes
- **Clientes** acessam seus próprios dados (contatos e tarefas)
- Sistema envia **notificações automáticas via WhatsApp** usando Evolution API
- Sistema envia **notificações via e-mail** usando Resend
- **Follow-ups automáticos** via cron job
- Interface clean, moderna e responsiva

---

## 🎨 IDENTIDADE DA MARCA

**Nome:** Balako Digital  
**Posicionamento:** Agência de marketing digital moderna, acessível (low-ticket), focada em automação e resultados  
**Tom de voz:** Profissional, objetivo, tecnológico

**Cores:**
- Primária: `#21808D` (teal/azul petróleo)
- Secundária: `#F59E0B` (laranja/amarelo)
- Background: `#F9FAFB` (cinza claro)
- Texto: `#111827` (preto)

---

## 🛠 STACK TECNOLÓGICA

**Base atual (NextCRM):**
- Next.js 14 (App Router)
- Prisma ORM
- MongoDB (será migrado para PostgreSQL/Supabase)
- NextAuth.js (autenticação)
- Shadcn/ui + Tailwind CSS
- TypeScript

**Stack alvo (CRM Balako Digital):**
- ✅ Next.js 14 (App Router) - manter
- ✅ TypeScript - manter
- ✅ Tailwind CSS + Shadcn/ui - manter
- ✅ NextAuth.js - manter
- 🔄 **Supabase** (PostgreSQL) - substituir MongoDB
- ➕ **Evolution API** - integração WhatsApp
- ➕ **Resend** - e-mails transacionais
- ➕ **Vercel Cron / cron-job.org** - automação

---

## 📊 MODELO DE DADOS (SUPABASE POSTGRESQL)

### Tabela: `users`
id: UUID (PK)

name: TEXT

email: TEXT (unique)

emailVerified: TIMESTAMP

image: TEXT

role: TEXT ('agency' | 'client') -- NOVO CAMPO

createdAt: TIMESTAMP

updatedAt: TIMESTAMP

text

### Tabela: `contacts`
id: UUID (PK)

name: TEXT (NOT NULL)

email: TEXT

phone: TEXT (NOT NULL) -- obrigatório para WhatsApp

company: TEXT

status: TEXT ('new', 'contacted', 'qualified', 'converted')

ownerId: UUID (FK → users.id)

createdAt: TIMESTAMP

updatedAt: TIMESTAMP

text

### Tabela: `tasks`
id: UUID (PK)

contactId: UUID (FK → contacts.id, ON DELETE CASCADE)

title: TEXT (NOT NULL)

description: TEXT

dueDate: TIMESTAMP (NOT NULL)

completed: BOOLEAN (default: false)

notificationSent: BOOLEAN (default: false) -- NOVO CAMPO

notifyViaWhatsApp: BOOLEAN (default: false) -- NOVO CAMPO

notifyViaEmail: BOOLEAN (default: false) -- NOVO CAMPO

ownerId: UUID (FK → users.id)

createdAt: TIMESTAMP

text

### Tabela: `whatsapp_messages` (NOVA)
id: UUID (PK)

contactId: UUID (FK → contacts.id, ON DELETE CASCADE)

phone: TEXT (NOT NULL)

message: TEXT (NOT NULL)

status: TEXT ('sent', 'delivered', 'read', 'failed')

sentBy: UUID (FK → users.id)

sentAt: TIMESTAMP

text

---

## 🔐 SISTEMA DE PERMISSÕES (ROLES)

### Role: `agency`
- ✅ Ver todos os contatos
- ✅ Ver todas as tarefas
- ✅ Criar/editar/deletar qualquer contato/tarefa
- ✅ Enviar WhatsApp para qualquer contato
- ✅ Acessar dashboard completo

### Role: `client`
- ✅ Ver apenas seus próprios contatos
- ✅ Ver apenas suas próprias tarefas
- ❌ Não pode deletar
- ✅ Pode editar apenas seus dados
- ✅ Dashboard limitado

**Implementação:** Verificar `session.user.role` em:
- API routes (`app/api/*`)
- Server components
- Prisma queries (filtrar por `ownerId`)

---

## 🚀 FUNCIONALIDADES CORE (MVP)

### 1. **Gestão de Contatos**
- ✅ CRUD completo (já existe no NextCRM)
- ✅ Lista com busca e filtros
- ✅ Formulário de criação/edição
- ➕ Campo `phone` obrigatório
- ➕ Botão "📱 Enviar WhatsApp" em cada contato

### 2. **Gestão de Tarefas (Follow-ups)**
- ✅ CRUD completo (já existe)
- ✅ Vincular tarefa a contato
- ➕ Checkboxes: "Notificar via WhatsApp" e "Notificar via Email"
- ➕ Data/hora de vencimento obrigatória
- ➕ Auto-notificação quando `dueDate` chegar

### 3. **Integração WhatsApp (Evolution API)**
- ➕ Envio manual de mensagem para contato
- ➕ Templates de mensagem prontos
- ➕ Histórico de mensagens enviadas
- ➕ Função automática via cron job

### 4. **Notificações Automáticas**
- ➕ Cron job verifica tarefas vencendo hoje
- ➕ Envia WhatsApp se `notifyViaWhatsApp = true`
- ➕ Envia Email se `notifyViaEmail = true`
- ➕ Marca `notificationSent = true` após envio

### 5. **Dashboard**
- ✅ Total de contatos (já existe)
- ✅ Tarefas pendentes hoje (já existe)
- ➕ Mensagens WhatsApp enviadas (hoje)
- ➕ Follow-ups pendentes
- 🗑️ Remover: Revenue forecast, invoices, reports

---

## 📁 ESTRUTURA DE ARQUIVOS ADAPTADA

nextcrm-app/
├── app/
│ ├── (routes)/
│ │ ├── dashboard/
│ │ │ └── page.tsx # Dashboard principal (adaptar)
│ │ ├── contacts/
│ │ │ ├── page.tsx # Lista de contatos (adaptar)
│ │ │ ├── [id]/page.tsx # Detalhes do contato (adaptar)
│ │ │ └── new/page.tsx # Criar contato (adaptar)
│ │ ├── tasks/
│ │ │ ├── page.tsx # Lista de tarefas (adaptar)
│ │ │ ├── [id]/page.tsx # Editar tarefa (adaptar)
│ │ │ └── new/page.tsx # Criar tarefa (adaptar)
│ │ └── whatsapp/ # NOVA SEÇÃO
│ │ ├── page.tsx # Histórico de mensagens
│ │ └── send/page.tsx # Enviar mensagem manual
│ ├── api/
│ │ ├── contacts/route.ts # API de contatos (adaptar permissões)
│ │ ├── tasks/route.ts # API de tarefas (adaptar permissões)
│ │ ├── whatsapp/ # NOVO
│ │ │ └── send/route.ts # Enviar WhatsApp
│ │ └── cron/ # NOVO
│ │ └── check-tasks/route.ts # Verificar tarefas vencendo
│ ├── layout.tsx # Layout global (adaptar branding)
│ └── globals.css # Estilos (adaptar cores)
├── components/
│ ├── ui/ # Shadcn components (já existem)
│ ├── Sidebar.tsx # Menu lateral (adaptar itens)
│ ├── Header.tsx # Header (adaptar logo)
│ ├── ContactCard.tsx # Card de contato (adaptar)
│ ├── TaskCard.tsx # Card de tarefa (adaptar)
│ ├── SendWhatsAppModal.tsx # NOVO - Modal enviar WhatsApp
│ └── NotificationBell.tsx # NOVO - Sino de notificações
├── lib/
│ ├── prisma.ts # Cliente Prisma (adaptar para Supabase)
│ ├── auth.ts # NextAuth config (adaptar)
│ ├── whatsapp.ts # NOVO - Funções WhatsApp
│ ├── email.ts # NOVO - Funções Email (Resend)
│ └── utils.ts # Utilitários (já existe)
├── prisma/
│ └── schema.prisma # Schema do banco (adaptar para PostgreSQL)
├── .env.local # Variáveis de ambiente
└── package.json

text

---

## 🔧 VARIÁVEIS DE AMBIENTE (.env.local)

Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"

NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[gerar com: openssl rand -base64 32]"
NEXTAUTH_PROVIDER_ID="google"
NEXTAUTH_PROVIDER_SECRET="[Google OAuth]"

Evolution API (WhatsApp)
EVOLUTION_API_URL="http://seu-vps-ip:8080"
EVOLUTION_API_KEY="sua-api-key"
EVOLUTION_INSTANCE_NAME="balako-crm"

Resend (Email)
RESEND_API_KEY="re_..."

Cron Job Security
CRON_SECRET="[gerar com: openssl rand -base64 32]"

App Config
NEXT_PUBLIC_APP_NAME="Balako Digital CRM"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

text

---

## 🎯 TAREFAS DE ADAPTAÇÃO PRIORITÁRIAS

### FASE 1: MIGRAÇÃO DE BANCO (CRÍTICO)
1. Trocar `provider = "mongodb"` → `provider = "postgresql"` em `schema.prisma`
2. Remover `@db.ObjectId` de todos os IDs
3. Trocar `@id @default(auto()) @db.ObjectId` → `@id @default(uuid())`
4. Adicionar campo `role` ao modelo `User`
5. Adicionar campos de notificação ao modelo `Task`
6. Criar modelo `WhatsAppMessage`
7. Rodar `npx prisma migrate dev --name supabase_migration`

### FASE 2: SISTEMA DE ROLES
1. Criar `lib/auth-helpers.ts` com funções `isAgency()`, `isClient()`, `requireAgency()`
2. Modificar API routes para verificar permissões
3. Filtrar queries do Prisma por `ownerId` para clientes
4. Adicionar campo "Role" no formulário de cadastro de usuário

### FASE 3: INTEGRAÇÃO WHATSAPP
1. Criar `lib/whatsapp.ts` com funções:
   - `sendWhatsAppMessage(phone, message)`
   - `formatPhoneNumber(phone)` - adiciona +55 e @s.whatsapp.net
   - `getInstanceStatus()` - verifica conexão
2. Criar `app/api/whatsapp/send/route.ts`
3. Criar componente `SendWhatsAppModal.tsx`
4. Adicionar botão "Enviar WhatsApp" na lista de contatos
5. Criar `lib/whatsapp-templates.ts` com templates prontos

### FASE 4: AUTOMAÇÃO (CRON)
1. Criar `app/api/cron/check-tasks/route.ts`
2. Buscar tarefas com `dueDate` hoje e `notificationSent = false`
3. Enviar notificações (WhatsApp + Email)
4. Marcar `notificationSent = true`
5. Configurar cron externo (cron-job.org ou Vercel Cron)

### FASE 5: NOTIFICAÇÕES EMAIL
1. Instalar `npm install resend`
2. Criar `lib/email.ts` com função `sendEmail(to, subject, text)`
3. Criar templates de email
4. Integrar com cron job

### FASE 6: LIMPEZA E BRANDING
1. Remover módulos não utilizados: invoices, reports, opportunities
2. Atualizar logo para "Balako Digital"
3. Mudar cores do Tailwind para paleta da Balako
4. Simplificar menu lateral (Dashboard, Contatos, Tarefas, WhatsApp, Configurações)
5. Atualizar textos e mensagens

---

## 🎨 DESIGN GUIDELINES

### Componentes UI (Shadcn/ui já instalado)
- Usar componentes existentes: Button, Input, Card, Dialog, Select
- Manter consistência visual
- Mobile-first (responsivo)

### Cores Tailwind (atualizar em `tailwind.config.ts`)
colors: {
primary: '#21808D', // teal
secondary: '#F59E0B', // laranja
background: '#F9FAFB', // cinza claro
foreground: '#111827', // preto
}

text

### Tipografia
- Fonte principal: Inter (já configurado)
- Tamanhos: text-sm, text-base, text-lg, text-xl

---

## 🚨 BOAS PRÁTICAS A SEGUIR

1. **TypeScript rigoroso** - Tipar todas as funções e componentes
2. **Error handling** - Sempre usar `try/catch` em async functions
3. **Loading states** - Mostrar skeleton/spinner durante fetch
4. **Validação** - Validar inputs com Zod antes de salvar
5. **Security** - Verificar permissões em TODAS as API routes
6. **Comments** - Comentar lógicas complexas
7. **Modularidade** - Componentes reutilizáveis e pequenos
8. **Acessibilidade** - Labels, ARIA attributes, keyboard navigation

---

## 🔄 FLUXO DE TRABALHO ESPERADO

1. **Você me envia um prompt específico** (ex: "Adaptar schema.prisma para Supabase")
2. **Eu gero o código completo**
3. **Você copia, testa e valida**
4. **Me avisa se funcionou ou se precisa ajuste**
5. **Passamos para o próximo TODO**

---

## ✅ CRITÉRIOS DE SUCESSO DO MVP

Ao final, o CRM deve:
- ✅ Autenticar usuários (agency e client)
- ✅ Agência ver todos os dados, cliente ver apenas seus
- ✅ CRUD completo de contatos e tarefas
- ✅ Enviar WhatsApp manual para contato
- ✅ Enviar notificações automáticas (cron job)
- ✅ Histórico de mensagens WhatsApp
- ✅ Dashboard com estatísticas atualizadas
- ✅ Interface responsiva e clean
- ✅ Deploy funcional na Vercel

---

## 📚 CONTEXTO TÉCNICO ADICIONAL

**NextCRM base features que vamos manter:**
- Sistema de autenticação (NextAuth)
- CRUD de contatos
- CRUD de tarefas
- Dashboard
- UI components (Shadcn)

**NextCRM features que vamos remover:**
- Invoices
- Opportunities
- Reports
- Email AI
- Stripe integration (se existir)

**Novas features exclusivas do Balako CRM:**
- Roles (agency/client)
- Integração WhatsApp
- Automação de follow-ups
- Notificações multi-canal
- Histórico de comunicação

---

## 🎯 INSTRUÇÕES FINAIS PARA VOCÊ (COPILOT)

Quando eu solicitar:
- **"Adapte X"** → Modifique código existente mantendo estrutura
- **"Crie Y"** → Gere novo arquivo do zero
- **"Adicione Z"** → Insira funcionalidade em código existente

Sempre:
- ✅ Gere código completo e funcional
- ✅ Inclua imports necessários
- ✅ Adicione comentários explicativos
- ✅ Use TypeScript com tipagem forte
- ✅ Trate erros adequadamente
- ✅ Siga convenções do Next.js 14 (App Router)

Nunca:
- ❌ Use placeholders ou comentários TODO
- ❌ Gere código incompleto
- ❌ Ignore error handling
- ❌ Esqueça de tipar variáveis
- ❌ Use bibliotecas não instaladas sem avisar

---

**PROJETO:** CRM Balako Digital  
**BASE:** NextCRM (pdovhomilja/nextcrm-app)  
**OBJETIVO:** MVP funcional em 2 dias  
**PRIORIDADE:** Funcionalidade > Design  
**DEADLINE:** Segunda-feira, 11 de novembro de 2025

Estou pronto para começar! 🚀