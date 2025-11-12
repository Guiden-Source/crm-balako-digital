# 🚀 GUIA DE DEPLOY - BALAKO DIGITAL CRM

## 📋 Pré-requisitos

Antes de fazer o deploy, você precisa:

1. ✅ Conta no Vercel (https://vercel.com)
2. ✅ Conta no Supabase (https://supabase.com) - JÁ CRIADO
3. ✅ Conta no Google Cloud Console para OAuth (https://console.cloud.google.com)
4. ✅ Repositório Git (GitHub, GitLab ou Bitbucket)

## 🔧 PASSO 1: Corrigir Dados no Banco (IMPORTANTE!)

Execute este SQL no Supabase SQL Editor:

```sql
-- Corrigir enum Language
UPDATE users 
SET "userLanguage" = 'pt' 
WHERE "userLanguage" IS NULL OR "userLanguage" != 'pt';
```

Ou execute o arquivo: `fix-language-enum.sql`

## 🔐 PASSO 2: Configurar Google OAuth

### 2.1. Criar Projeto no Google Cloud Console

1. Acesse: https://console.cloud.google.com
2. Crie um novo projeto ou selecione um existente
3. Vá em **APIs & Services** > **Credentials**

### 2.2. Criar Credenciais OAuth 2.0

1. Clique em **Create Credentials** > **OAuth 2.0 Client ID**
2. Se pedido, configure a **OAuth Consent Screen** primeiro:
   - User Type: **External**
   - App name: `Balako Digital CRM`
   - User support email: seu email
   - Developer contact: seu email
   - Adicione os escopos: `email`, `profile`
   
3. Criar OAuth Client ID:
   - Application type: **Web application**
   - Name: `Balako Digital CRM`
   - Authorized JavaScript origins:
     ```
     http://localhost:3000
     https://seu-dominio.vercel.app
     ```
   - Authorized redirect URIs:
     ```
     http://localhost:3000/api/auth/callback/google
     https://seu-dominio.vercel.app/api/auth/callback/google
     ```

4. **Copie** o **Client ID** e **Client Secret**

## 📦 PASSO 3: Preparar para Deploy

### 3.1. Criar Repositório Git (se ainda não tiver)

```bash
# Inicializar git (se necessário)
git init

# Adicionar remote (substitua com seu repo)
git remote add origin https://github.com/seu-usuario/seu-repo.git

# Fazer commit
git add .
git commit -m "Deploy inicial - Balako Digital CRM"

# Enviar para GitHub
git push -u origin main
```

### 3.2. Verificar arquivos importantes

✅ `.gitignore` deve conter:
```
.env.local
.env*.local
node_modules
.next
```

## 🌐 PASSO 4: Deploy no Vercel

### 4.1. Importar Projeto

1. Acesse: https://vercel.com
2. Clique em **Add New** > **Project**
3. Importe seu repositório do GitHub/GitLab/Bitbucket
4. Configure o projeto:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build` (já configurado)
   - **Output Directory**: .next (padrão)

### 4.2. Configurar Variáveis de Ambiente

Na tela de deploy, clique em **Environment Variables** e adicione:

#### 🗄️ Database (Supabase)
```env
DATABASE_URL=postgresql://postgres.jcrnbtzkkuxpbasfzlwx:e15m6bzyOEk0SCcx@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:e15m6bzyOEk0SCcx@db.jcrnbtzkkuxpbasfzlwx.supabase.co:5432/postgres
```

#### 🔐 NextAuth
```env
NEXTAUTH_URL=https://seu-app.vercel.app
NEXTAUTH_SECRET=hJ1r/x7i991Gly0iQSdDRCjxUECv5s29/xPaoKvr4iI=
```

#### 🔑 Google OAuth (use os valores do Passo 2)
```env
GOOGLE_ID=seu_google_client_id
GOOGLE_SECRET=seu_google_client_secret
```

#### 📧 Resend (Email)
```env
RESEND_API_KEY=re_seu_resend_api_key
```

#### ⏰ Cron Jobs
```env
CRON_SECRET=0a132800bb185a1ee4c3c85781a1034341b80245e75beee6fd09b9cdf5ecdd5c
```

#### 🎯 App Config
```env
NEXT_PUBLIC_APP_NAME=Balako Digital CRM
NEXT_PUBLIC_APP_URL=https://seu-app.vercel.app
NODE_ENV=production
```

#### 🔹 Supabase (opcional, mas recomendado)
```env
NEXT_PUBLIC_SUPABASE_URL=https://jcrnbtzkkuxpbasfzlwx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjcm5idHpra3V4cGJhc2Z6bHd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4ODI1OTcsImV4cCI6MjA3ODQ1ODU5N30.ZGs5kmnNrUn8aJVWggOP-xBkjP2twknsDjChH8PNtJo
```

### 4.3. Fazer Deploy

1. Clique em **Deploy**
2. Aguarde o build completar (2-5 minutos)
3. Quando finalizar, você terá uma URL: `https://seu-app.vercel.app`

## ✅ PASSO 5: Pós-Deploy

### 5.1. Atualizar Google OAuth Redirect URIs

1. Volte ao Google Cloud Console
2. Atualize as **Authorized redirect URIs** com a URL real:
   ```
   https://seu-app-real.vercel.app/api/auth/callback/google
   ```

### 5.2. Atualizar Variável NEXTAUTH_URL

1. No Vercel Dashboard > Settings > Environment Variables
2. Atualize `NEXTAUTH_URL` com a URL real:
   ```
   https://seu-app-real.vercel.app
   ```
3. Faça um **Redeploy** do projeto

### 5.3. Criar Primeiro Usuário Admin

1. Acesse: `https://seu-app.vercel.app/sign-in`
2. Faça login com Google
3. No Supabase SQL Editor, execute:
   ```sql
   -- Tornar usuário como ADMIN
   UPDATE users 
   SET role = 'agency', 
       "userStatus" = 'ACTIVE'
   WHERE email = 'seu-email@gmail.com';
   ```

### 5.4. Configurar WhatsApp (Opcional)

Execute a migration:
```sql
-- No Supabase SQL Editor
-- Cole o conteúdo de: migration-whatsapp-config.sql
```

## 🎉 DEPLOY COMPLETO!

Seu CRM está no ar em: `https://seu-app.vercel.app`

## 📝 Comandos Úteis

### Verificar logs no Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Ver logs em tempo real
vercel logs seu-app.vercel.app
```

### Fazer deploy manual (alternativa)
```bash
# Na raiz do projeto
vercel

# Para produção
vercel --prod
```

## 🔧 Troubleshooting

### Erro: "Database connection failed"
- Verifique se `DATABASE_URL` e `DIRECT_URL` estão corretos
- Verifique se o IP do Vercel está permitido no Supabase (geralmente é automático)

### Erro: "NextAuth callback error"
- Verifique se `NEXTAUTH_URL` está com a URL correta (sem / no final)
- Verifique se o redirect URI do Google está correto

### Erro: "Build failed"
```bash
# Teste o build localmente antes
npm run build
```

### Prisma não gera client
- Verifique se o `postinstall` script existe no package.json
- O script de build já inclui `prisma generate`

## 🚀 Melhorias Futuras

1. **Custom Domain**: Adicionar domínio customizado no Vercel
2. **WhatsApp**: Configurar Evolution API para produção
3. **Email**: Configurar domínio verificado no Resend
4. **Monitoring**: Adicionar Sentry ou LogRocket
5. **Analytics**: Adicionar Google Analytics
6. **Backup**: Configurar backup automático do Supabase

## 📞 Suporte

- Documentação Next.js: https://nextjs.org/docs
- Documentação Vercel: https://vercel.com/docs
- Documentação Supabase: https://supabase.com/docs
- Documentação NextAuth: https://next-auth.js.org

---

**Desenvolvido por Balako Digital** 🚀
**Versão**: 1.0.0-beta
