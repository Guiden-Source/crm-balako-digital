# ✅ CHECKLIST PRÉ-DEPLOY

## 🎯 Execute este checklist ANTES de fazer o deploy

### 1. 🗄️ Banco de Dados
- [ ] Executar `fix-language-enum.sql` no Supabase SQL Editor
- [ ] Verificar se todas as tabelas foram criadas
- [ ] Testar conexão com DATABASE_URL e DIRECT_URL

### 2. 🔐 Autenticação
- [ ] Criar OAuth Credentials no Google Cloud Console
- [ ] Configurar Authorized redirect URIs
- [ ] Copiar GOOGLE_ID e GOOGLE_SECRET

### 3. 📧 Email (Opcional)
- [ ] Criar conta no Resend (https://resend.com)
- [ ] Copiar RESEND_API_KEY
- [ ] Verificar domínio (se quiser usar email customizado)

### 4. 📦 Git
- [ ] Criar repositório no GitHub/GitLab/Bitbucket
- [ ] Fazer commit de todas as alterações
- [ ] Push para o remote
- [ ] Verificar se .env.local está no .gitignore

### 5. 🌐 Vercel
- [ ] Criar conta no Vercel
- [ ] Importar repositório
- [ ] Configurar TODAS as variáveis de ambiente (ver DEPLOY_GUIDE.md)
- [ ] Iniciar deploy

### 6. ✅ Pós-Deploy
- [ ] Atualizar NEXTAUTH_URL com URL real do Vercel
- [ ] Atualizar Google OAuth redirect URIs com URL real
- [ ] Fazer redeploy no Vercel
- [ ] Criar primeiro usuário admin (executar SQL no Supabase)
- [ ] Testar login com Google
- [ ] Verificar se dashboard carrega

## 🚨 IMPORTANTE

### Executar no Supabase ANTES do deploy:
```sql
-- 1. Corrigir enum Language
UPDATE users 
SET "userLanguage" = 'pt' 
WHERE "userLanguage" IS NULL OR "userLanguage" != 'pt';

-- 2. Verificar
SELECT COUNT(*) FROM users WHERE "userLanguage" != 'pt';
-- Deve retornar 0
```

### Variáveis de Ambiente OBRIGATÓRIAS:
```env
DATABASE_URL=...
DIRECT_URL=...
NEXTAUTH_URL=https://seu-app.vercel.app
NEXTAUTH_SECRET=hJ1r/x7i991Gly0iQSdDRCjxUECv5s29/xPaoKvr4iI=
GOOGLE_ID=...
GOOGLE_SECRET=...
NEXT_PUBLIC_APP_NAME=Balako Digital CRM
NEXT_PUBLIC_APP_URL=https://seu-app.vercel.app
NODE_ENV=production
```

### Opcionais (mas recomendadas):
```env
RESEND_API_KEY=...
CRON_SECRET=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 📝 Comandos Rápidos

### Teste local antes do deploy:
```bash
npm run build
npm start
```

### Se der erro no build:
```bash
npx prisma generate
npm run build
```

### Deploy manual (alternativa ao Vercel UI):
```bash
npm i -g vercel
vercel login
vercel --prod
```

## 🔍 Verificação Final

Antes de clicar em "Deploy":
1. ✅ SQL de correção executado no Supabase?
2. ✅ Google OAuth configurado com redirect URIs corretos?
3. ✅ Todas as variáveis de ambiente adicionadas no Vercel?
4. ✅ .env.local NÃO está no Git?
5. ✅ Build local funcionando sem erros?

Se todas as respostas forem SIM, você está pronto para o deploy! 🚀

---

📖 **Guia completo**: Ver `DEPLOY_GUIDE.md`
