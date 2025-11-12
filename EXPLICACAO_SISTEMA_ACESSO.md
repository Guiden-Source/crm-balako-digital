# 📝 RESUMO EXECUTIVO: Sistema de Acesso e WhatsApp Multi-Tenant

## 🎯 Objetivo
Criar um sistema onde:
- **Balako Digital (Agência)** vê e gerencia TUDO
- **Clientes** veem e gerenciam APENAS seus próprios dados
- Cada cliente tem sua própria conta WhatsApp isolada

---

## 🔐 COMO FUNCIONA O CONTROLE DE ACESSO

### Sistema de Roles (2 tipos)

#### 1. Role "agency" (Balako Digital)
**Permissões:**
- ✅ Ver TODOS os contatos de TODOS os clientes
- ✅ Ver TODAS as conversas WhatsApp de TODOS os clientes  
- ✅ Criar/editar/deletar qualquer recurso
- ✅ Acessar dashboard admin
- ✅ Gerenciar usuários
- ✅ Configurar WhatsApp de qualquer cliente

**Exemplo de uso:**
```
Você (Balako) tem 3 clientes: Marca A, Marca B, Marca C
Quando você faz login, você vê:
- Dashboard com métricas de todos os 3 clientes
- Lista de contatos: 150 contatos (50 de cada marca)
- WhatsApp: todas as conversas das 3 marcas
```

#### 2. Role "client" (Seus clientes)
**Permissões:**
- ✅ Ver APENAS seus próprios contatos
- ✅ Ver APENAS suas próprias conversas WhatsApp
- ✅ Criar/editar apenas seus próprios recursos
- ❌ NÃO pode deletar nada
- ❌ NÃO acessa dashboard admin
- ❌ NÃO vê dados de outros clientes

**Exemplo de uso:**
```
Cliente "Marca A" faz login e vê:
- Dashboard com apenas as métricas dele
- Lista de contatos: 50 contatos (só os dele)
- WhatsApp: só as conversas da conta WhatsApp dele
- NÃO vê nada das Marca B ou Marca C
```

---

## 📱 COMO FUNCIONA O WHATSAPP MULTI-TENANT

### Problema que estamos resolvendo:
❌ **ANTES:** Todos usavam a mesma conta WhatsApp (configurada no .env)
- Cliente A enviava mensagem
- Aparecia no WhatsApp da Balako
- Clientes viam conversas uns dos outros

✅ **AGORA:** Cada cliente tem sua própria conta WhatsApp
- Cliente A tem WhatsApp Business da Marca A
- Cliente B tem WhatsApp Business da Marca B
- Cliente C tem WhatsApp Business da Marca C
- Cada um vê apenas suas próprias conversas

### Como configurar WhatsApp para cada cliente:

#### Passo 1: Cliente faz login no CRM
```
Cliente "Marca A" entra em:
https://crm.balakodigital.com.br/settings/whatsapp
```

#### Passo 2: Preenche dados da Evolution API
```
Campo                  | Valor
-----------------------|--------------------------------
Evolution API URL      | https://evolution.seuservidor.com
Evolution API Key      | sua-chave-evolution-api
Nome da Instância      | marca-a-whatsapp
```

#### Passo 3: Clica em "Conectar WhatsApp"
- Sistema gera QR Code
- Cliente escaneia com WhatsApp Business da Marca A
- WhatsApp conecta
- Status muda para "CONECTADO" ✅

#### Passo 4: Usar o WhatsApp no CRM
- Cliente vai em Contatos
- Clica em "Enviar WhatsApp"
- Mensagem sai do WhatsApp da Marca A
- Conversa fica registrada no CRM
- Apenas esse cliente vê essa conversa

### Tabela do Banco: WhatsAppConfig

```sql
CREATE TABLE "WhatsAppConfig" (
    id              TEXT PRIMARY KEY,
    userId          TEXT UNIQUE,              -- FK para Users
    evolutionApiUrl TEXT,                     -- URL da Evolution API
    evolutionApiKey TEXT,                     -- Chave de API
    instanceName    TEXT,                     -- Nome da instância
    phoneNumber     TEXT,                     -- Número conectado
    status          TEXT DEFAULT 'DISCONNECTED', -- Status da conexão
    qrCode          TEXT,                     -- QR Code para conectar
    createdAt       TIMESTAMP,
    updatedAt       TIMESTAMP
);
```

---

## 🛡️ ISOLAMENTO DE DADOS - COMO GARANTE QUE CLIENTES NÃO VEJAM DADOS DE OUTROS

### Nível 1: Middleware (Automático)

Toda query passa por filtro automático em `lib/auth-helpers.ts`:

```typescript
// Se o usuário for "agency"
where: {} // Vê tudo

// Se o usuário for "client"
where: {
  OR: [
    { created_by: "id-do-cliente" },
    { assigned_to: "id-do-cliente" }
  ]
} // Vê apenas o que criou ou foi atribuído a ele
```

### Nível 2: API Routes (Validação)

Toda API verifica permissões antes de executar:

```typescript
// Exemplo: Deletar contato
export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  
  // 1. Busca o contato
  const contact = await db.contacts.findUnique({
    where: { id: params.id }
  });
  
  // 2. Verifica se o usuário pode acessar
  if (!canAccessResource(session, contact.created_by)) {
    return new Response("Sem permissão", { status: 403 });
  }
  
  // 3. Se passou, pode deletar
  await db.contacts.delete({ where: { id: params.id } });
}
```

### Nível 3: UI (Esconde opções)

No front-end, esconde opções que o usuário não pode usar:

```tsx
{isAgency(session) && (
  <Button onClick={deleteContact}>
    Deletar
  </Button>
)}

{isClient(session) && (
  <Button disabled title="Apenas agências podem deletar">
    Deletar
  </Button>
)}
```

---

## 🚀 COMO CRIAR USUÁRIOS E GERENCIAR ACESSOS

### Para Balako Digital (Você):

#### 1. Criar novo cliente:
```
1. Login como admin
2. Ir em /admin/users
3. Clicar em "Convidar novo usuário"
4. Preencher:
   - Nome: João Silva
   - Email: joao@marcaa.com.br
   - Role: CLIENT (importante!)
   - Status: ACTIVE
5. Salvar
6. Cliente recebe email com link de ativação
```

#### 2. Cliente faz primeiro acesso:
```
1. Cliente clica no link do email
2. Define senha
3. Faz login
4. É redirecionado para dashboard (vazio)
5. Vai em /settings/whatsapp
6. Configura WhatsApp dele
7. Pronto! Agora pode usar o CRM
```

#### 3. Gerenciar permissões:
```
Para mudar role de cliente para agência:
1. /admin/users
2. Clicar no usuário
3. Editar campo "role" de "client" para "agency"
4. Salvar
5. Usuário precisa fazer logout/login
6. Agora ele vê tudo (igual você)
```

### Para Clientes:

Clientes **NÃO** podem:
- Criar outros usuários
- Acessar /admin
- Ver ou editar roles
- Ver dados de outros clientes

Clientes **PODEM**:
- Gerenciar seus próprios contatos
- Enviar WhatsApp para seus contatos
- Ver suas tarefas/follow-ups
- Configurar SEU WhatsApp
- Editar seu perfil

---

## 📊 DASHBOARD DIFERENCIADO

### Dashboard da Agência (Balako):
```
┌─────────────────────────────────────────┐
│   📊 DASHBOARD - BALAKO DIGITAL         │
├─────────────────────────────────────────┤
│                                         │
│  Total de Clientes: 3                   │
│  Total de Contatos: 150                 │
│  Mensagens WhatsApp (Hoje): 45          │
│  Follow-ups Pendentes: 12               │
│                                         │
│  📈 MÉTRICAS POR CLIENTE:               │
│  ┌─────────────────────────────────┐    │
│  │ Marca A: 50 contatos, 15 msgs  │    │
│  │ Marca B: 60 contatos, 20 msgs  │    │
│  │ Marca C: 40 contatos, 10 msgs  │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### Dashboard do Cliente (Marca A):
```
┌─────────────────────────────────────────┐
│   📊 DASHBOARD - MARCA A                │
├─────────────────────────────────────────┤
│                                         │
│  Meus Contatos: 50                      │
│  Mensagens WhatsApp (Hoje): 15          │
│  Meus Follow-ups Pendentes: 4           │
│                                         │
│  Status WhatsApp: ✅ Conectado          │
│  Número: (11) 9xxxx-xxxx                │
│                                         │
└─────────────────────────────────────────┘
```

---

## ⚠️ IMPORTANTE: SEGURANÇA

### Nunca fazer:
❌ Confiar apenas no front-end para esconder dados
❌ Usar apenas roles para proteger rotas
❌ Expor credenciais WhatsApp no código do cliente
❌ Permitir clientes deletarem dados permanentemente

### Sempre fazer:
✅ Validar permissões no servidor (API routes)
✅ Aplicar filtros baseados em role em TODAS as queries
✅ Logar todas as ações críticas
✅ Usar HTTPS em produção
✅ Encriptar senhas com bcrypt (já implementado)
✅ Armazenar tokens WhatsApp de forma segura

---

## 📁 ARQUIVOS CRIADOS/MODIFICADOS

### ✅ JÁ IMPLEMENTADO:
1. `lib/auth-helpers.ts` - Sistema de autorização
2. `lib/whatsapp.ts` - Integração Evolution API
3. `lib/email.ts` - Envio de emails
4. `prisma/schema.prisma` - Schema com WhatsAppConfig
5. `app/[locale]/(routes)/admin/users/table-components/columns.tsx` - Coluna de role adicionada
6. `migration-whatsapp-config.sql` - Migration para criar tabela

### 📝 FALTA IMPLEMENTAR:
1. `app/[locale]/(routes)/settings/whatsapp/page.tsx` - Página de config
2. `actions/whatsapp/create-config.ts` - CRUD de configuração
3. `actions/whatsapp/generate-qr-code.ts` - Geração de QR Code
4. `actions/whatsapp/check-status.ts` - Verificar status
5. `lib/whatsapp.ts` - Atualizar para usar config do cliente

---

## 🎯 PRÓXIMOS PASSOS

### HOJE (Crítico):
1. ✅ Adicionar coluna "Role" no admin (FEITO)
2. ✅ Criar model WhatsAppConfig (FEITO)
3. ⏳ Executar migration no Supabase
4. ⏳ Testar criação de usuários com roles diferentes

### ESTA SEMANA:
5. Criar página /settings/whatsapp
6. Implementar conexão Evolution API
7. Testar envio de WhatsApp multi-tenant

### PRÓXIMA SEMANA:
8. Dashboard diferenciado por role
9. Logs de auditoria
10. Testes de segurança completos

---

## 💡 DÚVIDAS FREQUENTES

**Q: Posso ter mais de um usuário "agency"?**
A: Sim! Você pode criar quantos usuários "agency" quiser. Todos terão acesso total.

**Q: Cliente pode se transformar em agência?**
A: Não. Apenas administradores podem mudar roles em /admin/users.

**Q: O que acontece se cliente tentar acessar dados de outro?**
A: A API retorna erro 403 (Forbidden) e registra tentativa no log.

**Q: Preciso de um servidor Evolution API para cada cliente?**
A: Não! Você pode usar 1 servidor Evolution API e criar múltiplas instâncias. Cada instância = 1 WhatsApp.

**Q: Como sei se o WhatsApp de um cliente está conectado?**
A: No dashboard dele aparece status. Se desconectar, ele recebe notificação e precisa reconectar.

---

**Documento criado por:** GitHub Copilot  
**Data:** 12/11/2025  
**Status:** ✅ Pronto para implementação
