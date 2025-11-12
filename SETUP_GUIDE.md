# =============================================================================
# 🚀 GUIA DE CONFIGURAÇÃO - BALAKO DIGITAL CRM
# =============================================================================

## FASE 1: CONFIGURAR SUPABASE

### Passo 1: Criar Projeto no Supabase

1. Acesse: https://database.new
2. Faça login com GitHub
3. Clique em "New Project"
4. Preencha:
   - **Name:** balako-crm
   - **Database Password:** [gere uma senha forte]
   - **Region:** South America (São Paulo) - `sa-east-1`
5. Clique em "Create new project"
6. Aguarde ~2 minutos enquanto o projeto é provisionado

### Passo 2: Obter Credenciais de Conexão

1. No dashboard do Supabase, vá em:
   ```
   Project Settings (ícone engrenagem) > Database
   ```

2. Na seção "Connection string", encontre:
   - **Connection pooling** (porta 6543 - Transaction mode)
   - Copie a URI completa

3. A string terá este formato:
   ```
   postgresql://postgres.abcdefghijklmnop:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

4. Para DIRECT_URL, use a mesma string mas:
   - Troque porta `6543` por `5432`
   - Remova `?pgbouncer=true`
   - Troque o host: `aws-0-sa-east-1.pooler.supabase.com` → `db.[PROJECT_REF].supabase.co`

### Passo 3: Gerar Secrets

Execute no terminal (macOS/Linux):

```bash
# Gerar NEXTAUTH_SECRET
openssl rand -base64 32

# Gerar CRON_SECRET
openssl rand -hex 32
```

### Passo 4: Preencher .env.local

Abra o arquivo `.env.local` na raiz do projeto e preencha com suas credenciais:

---

## EXEMPLO DE .env.local PREENCHIDO

```bash
# =============================================================================
# SUPABASE POSTGRESQL DATABASE
# =============================================================================

DATABASE_URL="postgresql://postgres.xyzabcd123456:[SUA_SENHA_AQUI]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[SUA_SENHA_AQUI]@db.xyzabcd123456.supabase.co:5432/postgres"

# =============================================================================
# NEXTAUTH - AUTENTICAÇÃO
# =============================================================================

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="Ab3dEf8gHiJ2kLm5NoPqRs7TuVwXyZ1aB4cD6eF9gH0iJ="

# =============================================================================
# RESEND - ENVIO DE E-MAILS
# =============================================================================

RESEND_API_KEY="re_123456789abcdefghijklmnopqrstuvwxyz"

# =============================================================================
# EVOLUTION API - WHATSAPP
# =============================================================================

EVOLUTION_API_URL="http://localhost:8080"
EVOLUTION_API_KEY="SUA_API_KEY_EVOLUTION_AQUI"
EVOLUTION_INSTANCE_NAME="balako-crm-instance"

# =============================================================================
# CRON JOB - TAREFAS AGENDADAS
# =============================================================================

CRON_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"

# =============================================================================
# APP CONFIGURATION
# =============================================================================

NEXT_PUBLIC_APP_NAME="Balako Digital CRM"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

---

## ⚠️ NOTAS IMPORTANTES

### DATABASE_URL vs DIRECT_URL

**DATABASE_URL** (porta 6543):
- Usa connection pooling (pgbouncer)
- Ideal para produção
- Limite de conexões gerenciado automaticamente
- Usado pelo Prisma Client em runtime

**DIRECT_URL** (porta 5432):
- Conexão direta ao PostgreSQL
- Necessário para migrations
- Usado apenas durante `prisma migrate`
- Sem connection pooling

### Como Identificar seu PROJECT_REF

No Supabase Dashboard, veja a URL:
```
https://app.supabase.com/project/xyzabcd123456
                                    ^^^^^^^^^^^^^^
                                    Este é seu PROJECT_REF
```

Ou em Project Settings > General > Reference ID

### Formato das URLs Supabase

**CONNECTION POOLING (DATABASE_URL):**
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**DIRECT CONNECTION (DIRECT_URL):**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
```

### Verificar Região

Certifique-se de usar a região correta:
- **sa-east-1** (São Paulo) - Recomendado para Brasil
- **us-east-1** (Virgínia) - Padrão
- **eu-west-1** (Irlanda) - Europa

---

## ✅ CHECKLIST DE VALIDAÇÃO

Antes de prosseguir, confirme:

- [ ] Projeto Supabase criado com nome "balako-crm"
- [ ] Região: South America (sa-east-1) selecionada
- [ ] DATABASE_URL copiada (porta 6543)
- [ ] DIRECT_URL configurada (porta 5432)
- [ ] NEXTAUTH_SECRET gerado (32+ caracteres)
- [ ] CRON_SECRET gerado (32+ caracteres)
- [ ] Arquivo .env.local salvo na raiz do projeto
- [ ] Nenhuma senha exposta em código ou commits
- [ ] .env.local está no .gitignore

---

## 🔐 SEGURANÇA

**NUNCA:**
- Commite o arquivo .env.local no Git
- Exponha suas senhas em screenshots
- Compartilhe suas credenciais em chats públicos

**SEMPRE:**
- Use senhas fortes (letras maiúsculas, minúsculas, números, símbolos)
- Rotacione secrets periodicamente
- Mantenha backup seguro das credenciais

---

## 🆘 PROBLEMAS COMUNS

### "Connection refused" ao tentar conectar

**Causa:** Firewall ou IP não autorizado

**Solução:**
1. Vá em Supabase Dashboard
2. Project Settings > Database > Connection pooling
3. Em "IP allow list", adicione `0.0.0.0/0` (permite todos os IPs)
4. Para produção, restrinja aos IPs específicos

### "Password authentication failed"

**Causa:** Senha incorreta no .env.local

**Solução:**
1. Vá em Supabase Dashboard
2. Project Settings > Database
3. Clique em "Reset Database Password"
4. Gere nova senha
5. Atualize .env.local

### Não consigo encontrar PROJECT_REF

**Solução:**
1. Vá em Project Settings > General
2. Procure por "Reference ID"
3. Copie o ID (formato: abcdefghijklmnop)

---

## 📞 PRÓXIMOS PASSOS

Após preencher o .env.local, prossiga para:

**FASE 2:** Rodar Migrations do Prisma
- Executar `npx prisma migrate dev`
- Gerar Prisma Client
- Verificar tabelas no Supabase

---

**Data:** 11 de novembro de 2025
**Versão:** 1.0
**Projeto:** Balako Digital CRM
