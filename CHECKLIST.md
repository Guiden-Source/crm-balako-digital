# 🚀 CHECKLIST DE CONFIGURAÇÃO - BALAKO DIGITAL CRM

Use este arquivo para acompanhar seu progresso na configuração do projeto.
Marque cada item conforme for completando: `[ ]` → `[x]`

---

## 📋 FASE 1: CONFIGURAR BANCO DE DADOS (SUPABASE)

### Criar Projeto Supabase
- [ ] Acessei https://database.new
- [ ] Criei projeto com nome "balako-crm"
- [ ] Selecionei região: South America (sa-east-1)
- [ ] Gerei senha forte para o banco
- [ ] Aguardei provisionamento do projeto (2-3 min)

### Obter Credenciais
- [ ] Acessei Project Settings > Database
- [ ] Copiei Connection String (porta 6543)
- [ ] Identifiquei meu PROJECT_REF
- [ ] Anotei a senha do banco em local seguro

### Gerar Secrets
- [ ] Executei `openssl rand -base64 32` para NEXTAUTH_SECRET
- [ ] Executei `openssl rand -hex 32` para CRON_SECRET
- [ ] Salvei ambos os secrets

### Preencher .env.local
- [ ] Abri arquivo .env.local na raiz do projeto
- [ ] Preenchi DATABASE_URL (porta 6543, com pgbouncer)
- [ ] Preenchi DIRECT_URL (porta 5432, sem pgbouncer)
- [ ] Preenchi NEXTAUTH_URL (http://localhost:3000)
- [ ] Preenchi NEXTAUTH_SECRET (gerado acima)
- [ ] Preenchi CRON_SECRET (gerado acima)
- [ ] Salvei o arquivo

---

## 📋 FASE 2: RODAR MIGRATIONS DO PRISMA

### Instalar Dependências
- [ ] Executei `npm install` (ou pnpm/yarn)
- [ ] Instalação concluída sem erros
- [ ] Verifiquei que node_modules foi criado

### Gerar Prisma Client
- [ ] Executei `npx prisma generate`
- [ ] Comando concluído com sucesso
- [ ] Vi mensagem "Generated Prisma Client"

### Executar Migrations
- [ ] Executei `npx prisma migrate dev --name init_supabase`
- [ ] Migration aplicada com sucesso
- [ ] OU executei `npx prisma db push` (se migrate falhou)
- [ ] Vi mensagem de sucesso

### Verificar Tabelas no Supabase
- [ ] Acessei Supabase Dashboard
- [ ] Fui em Table Editor
- [ ] Confirmo que existem estas tabelas:
  - [ ] Users
  - [ ] crm_Contacts
  - [ ] Tasks
  - [ ] WhatsAppMessage
  - [ ] crm_Accounts
  - [ ] crm_Leads

---

## 📋 FASE 3: INSTALAR DEPENDÊNCIAS FALTANTES

### Pacotes Essenciais
- [ ] Executei `npm install resend`
- [ ] Executei `npm install axios`
- [ ] Todos os pacotes instalados sem conflitos

### Verificar package.json
- [ ] Confirmo que package.json contém:
  - [ ] `"resend": "^3.0.0"` (ou similar)
  - [ ] `"axios": "^1.0.0"` (ou similar)
  - [ ] `"@prisma/client": "^5.0.0"` (ou similar)
  - [ ] `"next": "^14.0.0"` (ou similar)

---

## 📋 FASE 4: TESTAR APLICAÇÃO LOCALMENTE

### Iniciar Servidor
- [ ] Executei `npm run dev`
- [ ] Servidor iniciou sem erros
- [ ] Vi mensagem "Ready on http://localhost:3000"

### Acessar Aplicação
- [ ] Acessei http://localhost:3000
- [ ] Página inicial carregou corretamente
- [ ] Não há erros no console do navegador (F12)
- [ ] Não há erros no terminal

### Verificar Branding
- [ ] Logo/nome mostra "Balako Digital CRM"
- [ ] Cores estão corretas (teal #21808D)
- [ ] Menu lateral tem 5 itens:
  - [ ] Dashboard
  - [ ] Contatos
  - [ ] Follow-ups
  - [ ] WhatsApp
  - [ ] Configurações

---

## 📋 FASE 5: TESTAR AUTENTICAÇÃO

### Criar Primeiro Usuário
- [ ] Acessei página de registro (/register ou /auth/signup)
- [ ] Criei conta com:
  - Email: teste@balakodigital.com
  - Senha: Teste@123
- [ ] Recebi confirmação de sucesso

### Configurar Role no Supabase
- [ ] Acessei Supabase Dashboard
- [ ] Fui em Table Editor > Users
- [ ] Localizei meu usuário (teste@balakodigital.com)
- [ ] Editei campo `role` para "agency"
- [ ] Salvei alteração

### Testar Login
- [ ] Fiz logout da aplicação
- [ ] Fiz login novamente com as credenciais
- [ ] Login bem-sucedido
- [ ] Fui redirecionado para dashboard
- [ ] Vejo todos os widgets do dashboard

---

## 📋 FASE 6: CONFIGURAR EVOLUTION API (WHATSAPP)

### Escolher Método
- [ ] Decidi entre:
  - [ ] Opção A: Testar localmente com Docker
  - [ ] Opção B: Configurar em VPS de produção

### Opção A: Setup Local com Docker
- [ ] Tenho Docker instalado
- [ ] Clonei repositório: `git clone https://github.com/EvolutionAPI/evolution-api.git`
- [ ] Entrei na pasta: `cd evolution-api`
- [ ] Copiei .env: `cp .env.example .env`
- [ ] Executei: `docker-compose up -d`
- [ ] Acessei http://localhost:8080
- [ ] Criei instância no painel
- [ ] Conectei WhatsApp via QR Code
- [ ] Status: "Connected"

### Configurar no CRM
- [ ] Atualizei .env.local:
  - EVOLUTION_API_URL="http://localhost:8080"
  - EVOLUTION_API_KEY="[minha-api-key]"
  - EVOLUTION_INSTANCE_NAME="[nome-da-instancia]"
- [ ] Reiniciei servidor: `npm run dev`

### Opção B: VPS (Produção)
- [ ] Contratei VPS (Hostinger/Contabo/Hetzner)
- [ ] Instalei Docker no servidor
- [ ] Configurei domínio (evolution.meudominio.com)
- [ ] Instalei SSL (Certbot)
- [ ] Instalei Evolution API no servidor
- [ ] Configurei firewall (portas 80, 443)
- [ ] Testei acesso via domínio

---

## 📋 FASE 7: VALIDAÇÃO E TESTES FUNCIONAIS

### Testar CRUD de Contatos
- [ ] Logado como usuário "agency"
- [ ] Acessei menu "Contatos"
- [ ] Cliquei em "Novo Contato"
- [ ] Criei contato:
  - Nome: João Silva
  - Email: joao@teste.com
  - Telefone: (11) 99999-9999
- [ ] Contato foi salvo com sucesso
- [ ] Aparece na lista de contatos
- [ ] Consegui editar o contato
- [ ] Consegui deletar o contato

### Testar CRUD de Tarefas
- [ ] Acessei menu "Follow-ups" ou "Tasks"
- [ ] Cliquei em "Nova Tarefa"
- [ ] Criei tarefa:
  - Título: Ligar para João
  - Descrição: Follow-up sobre proposta
  - Vinculei ao contato
  - Data: hoje
  - Marquei: Notificar via WhatsApp
  - Marquei: Notificar via Email
- [ ] Tarefa foi salva
- [ ] Aparece no dashboard (widget "Follow-ups Pendentes")
- [ ] Campos de notificação foram salvos

### Testar Envio de WhatsApp (se Evolution configurada)
- [ ] Na lista de contatos, cliquei em botão WhatsApp
- [ ] Modal abriu corretamente
- [ ] Telefone estava pré-preenchido
- [ ] Selecionei template "Follow-up"
- [ ] Cliquei em "Enviar"
- [ ] Vi toast de sucesso OU erro (se não configurado)
- [ ] Mensagem chegou no meu WhatsApp (se configurado)

### Testar Sistema de Roles
- [ ] Criei segundo usuário (cliente@teste.com)
- [ ] Editei role para "client" no Supabase
- [ ] Fiz login como "client"
- [ ] Vejo apenas MEUS contatos
- [ ] Não vejo contatos de outros usuários
- [ ] Não consigo deletar contatos (se restrito)
- [ ] Fiz logout
- [ ] Fiz login como "agency"
- [ ] Vejo TODOS os contatos
- [ ] Consigo deletar qualquer contato

### Testar Dashboard
- [ ] Widget "Mensagens WhatsApp (hoje)" exibe contagem
- [ ] Widget "Follow-ups Pendentes" exibe contagem
- [ ] Widget "Total de Contatos" exibe contagem
- [ ] Widget "Tarefas Hoje" exibe contagem
- [ ] Todos os números estão corretos

---

## 📋 FASE 8: DEBUG E AJUSTES

### Erros Encontrados
- [ ] Nenhum erro encontrado (pule esta seção)
- [ ] Encontrei erros e resolvi:

**Erro 1:**
```
[Descreva o erro aqui]
```
**Solução:**
```
[Descreva a solução aqui]
```

**Erro 2:**
```
[Descreva o erro aqui]
```
**Solução:**
```
[Descreva a solução aqui]
```

---

## 📋 FASE 9: DEPLOY (OPCIONAL - PRODUÇÃO)

### Preparar para Deploy
- [ ] Criei conta no Vercel
- [ ] Conectei repositório GitHub
- [ ] Configurei variáveis de ambiente no Vercel:
  - DATABASE_URL
  - DIRECT_URL
  - NEXTAUTH_URL (com domínio real)
  - NEXTAUTH_SECRET
  - RESEND_API_KEY
  - EVOLUTION_API_URL (com domínio real)
  - EVOLUTION_API_KEY
  - EVOLUTION_INSTANCE_NAME
  - CRON_SECRET

### Deploy Inicial
- [ ] Executei deploy no Vercel
- [ ] Build concluído com sucesso
- [ ] Acessei URL de produção
- [ ] Aplicação carregou corretamente

### Configurar Domínio
- [ ] Adicionei domínio customizado no Vercel
- [ ] Configurei DNS (CNAME ou A record)
- [ ] SSL gerado automaticamente
- [ ] Acessei via domínio customizado

---

## ✅ STATUS GERAL

- [ ] ✅ Todas as fases concluídas
- [ ] 🚀 Aplicação rodando em produção
- [ ] 📱 WhatsApp funcionando
- [ ] 🔐 Autenticação funcionando
- [ ] 📊 Dashboard exibindo dados corretos
- [ ] 👥 Roles (agency/client) funcionando

---

## 📝 NOTAS ADICIONAIS

Use este espaço para anotações durante a configuração:

```
[Suas notas aqui]








```

---

**Data de Início:** _____/_____/_____
**Data de Conclusão:** _____/_____/_____
**Versão do Projeto:** 1.0.0-beta
**Responsável:** ___________________________
