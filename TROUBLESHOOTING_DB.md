# 🔧 Troubleshooting - Conexão com Banco de Dados

## ❌ Erro Atual: "Tenant or user not found" / "Can't reach database server"

Este erro geralmente indica um problema com as credenciais ou configuração do Supabase.

---

## ✅ Checklist de Verificação

### 1. Verifique se o projeto Supabase está ativo
- [ ] Acesse: https://supabase.com/dashboard/project/jcrnbtzkkuxpbasfzlwx
- [ ] Confirme que o projeto está **ACTIVE** (não pausado)
- [ ] Se estiver pausado, clique em "Resume Project"

### 2. Verifique as credenciais do banco
- [ ] Vá em **Settings > Database**
- [ ] Copie novamente a **Connection String**

**⚠️ IMPORTANTE:** A senha pode conter caracteres especiais que precisam ser codificados!

#### Como codificar a senha corretamente:

Se sua senha for: `uCMP3rnzcsiwl0cU`

Execute no terminal:
```bash
node -e "console.log(encodeURIComponent('uCMP3rnzcsiwl0cU'))"
```

Ou use um site como: https://www.urlencoder.org/

### 3. Atualize as URLs no .env.local

Copie as strings de conexão **exatamente** como aparecem no Supabase Dashboard:

#### Session Mode (para DATABASE_URL - porta 6543):
```
Connection pooling: Session
postgres://postgres.jcrnbtzkkuxpbasfzlwx:[SUA_SENHA_AQUI]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

#### Transaction Mode (para DIRECT_URL - porta 5432):
```
postgres://postgres:[SUA_SENHA_AQUI]@db.jcrnbtzkkuxpbasfzlwx.supabase.co:5432/postgres
```

### 4. Teste a conexão diretamente

Execute no terminal para testar:
```bash
# Teste 1: Verificar se consegue pingar o servidor
ping db.jcrnbtzkkuxpbasfzlwx.supabase.co

# Teste 2: Tentar conectar via psql (se tiver instalado)
export $(cat .env.local | grep -v '^#' | xargs)
psql "$DIRECT_URL"
```

### 5. Verifique as configurações de rede

- [ ] Confirme que sua rede não está bloqueando as portas 5432 e 6543
- [ ] Se estiver em uma rede corporativa, pode precisar de VPN
- [ ] Tente desabilitar temporariamente o firewall/antivírus

---

## 🔄 Alternativa: Use o Supabase Dashboard para executar SQL diretamente

Se a conexão continuar falhando, você pode criar as tabelas manualmente:

1. Acesse: https://supabase.com/dashboard/project/jcrnbtzkkuxpbasfzlwx/editor
2. Vá em **SQL Editor**
3. Execute o seguinte comando para gerar o SQL do schema:

```bash
export $(cat .env.local | grep -v '^#' | xargs) && npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > schema.sql
```

4. Copie o conteúdo de `schema.sql` e execute no SQL Editor do Supabase

---

## 🆕 Alternativa 2: Criar novo projeto Supabase

Se nada funcionar, considere criar um novo projeto:

1. Acesse https://supabase.com/dashboard
2. Clique em "New Project"
3. Configure:
   - **Name:** Balako Digital CRM
   - **Database Password:** (escolha uma senha SIMPLES primeiro, ex: `Password123`)
   - **Region:** South America (São Paulo) - mais próximo do Brasil
4. Aguarde ~2 minutos para o projeto ser criado
5. Copie as novas credenciais para `.env.local`
6. Tente novamente: `npx prisma db push`

---

## 📞 Precisa de ajuda?

Se o erro persistir, me informe:

1. ✅ O projeto está ativo no Supabase?
2. 🔐 Você conseguiu copiar as connection strings atualizadas?
3. 🌐 Está usando alguma VPN ou rede corporativa?
4. 💻 Qual erro exato aparece agora?

Execute e me envie o resultado:
```bash
export $(cat .env.local | grep -v '^#' | xargs)
echo "DATABASE_URL conectando em: $(echo $DATABASE_URL | sed 's/:.*@/@***@/')"
echo "DIRECT_URL conectando em: $(echo $DIRECT_URL | sed 's/:.*@/@***@/')"
```
