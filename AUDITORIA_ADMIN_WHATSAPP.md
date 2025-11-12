# 🔍 AUDITORIA COMPLETA: Admin Dashboard & Sistema de Acesso WhatsApp

**Data:** 12 de novembro de 2025  
**CRM:** Balako Digital CRM  
**Versão:** 1.0.0-beta

---

## 📊 PARTE 1: AUDITORIA DO DASHBOARD ADMIN

### ✅ O que está funcionando:

1. **Página de Usuários** (`/admin/users`)
   - ✅ Lista todos os usuários do sistema
   - ✅ Proteção básica por `isAdmin` (apenas admins acessam)
   - ✅ Formulário de convite de novos usuários
   - ✅ Envio de email para todos os usuários
   - ✅ Data table com filtros e ordenação
   - ✅ Colunas: Data criação, Último login, Nome, Email, Is Admin, Status, Idioma

2. **Campos no Schema (Users)**
   ```prisma
   - id (UUID)
   - email (único)
   - name
   - password (bcrypt)
   - role (agency/client) ✅ IMPORTANTE
   - is_admin (boolean)
   - userStatus (ACTIVE/INACTIVE/PENDING)
   - userLanguage (pt)
   - created_on
   - lastLoginAt
   ```

### ❌ O que está faltando ou precisa melhorar:

#### 1. **Coluna "Role" não aparece na tabela de usuários**
   - A tabela mostra `is_admin` mas **NÃO mostra o campo `role`**
   - **CRÍTICO:** Sem visualização do role, o admin não sabe quem é "agency" vs "client"

#### 2. **Falta campo para configurar WhatsApp por cliente**
   - Não há lugar para armazenar credenciais Evolution API por cliente
   - Cada cliente deveria ter sua própria instância WhatsApp

#### 3. **Falta sistema de multi-tenant para WhatsApp**
   - Atualmente usa apenas 1 instância global (variáveis de ambiente)
   - Precisa suportar múltiplas instâncias (1 por cliente)

#### 4. **Sem controle de isolamento de dados**
   - Não há filtros automáticos por `created_by` ou `assigned_to` em todas as queries
   - Clientes podem ver dados de outros clientes se não houver filtros corretos

#### 5. **Falta dashboard específico por role**
   - Agency deveria ver métricas de TODOS os clientes
   - Client deveria ver apenas suas próprias métricas

---

## 🔐 PARTE 2: SISTEMA DE CONTROLE DE ACESSO (Multi-Tenant)

### Arquitetura Proposta:

```
┌─────────────────────────────────────────────────────────┐
│                   BALAKO DIGITAL CRM                    │
│                     (Sua Agência)                       │
└─────────────────────────────────────────────────────────┘
                           │
                           │ role: "agency"
                           │ Acesso TOTAL
                           ▼
        ┌──────────────────────────────────────┐
        │      DADOS DE TODOS OS CLIENTES      │
        │  - Todos os contatos                 │
        │  - Todas as conversas WhatsApp       │
        │  - Todos os follow-ups               │
        │  - Dashboard completo                │
        └──────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   ┌─────────┐       ┌─────────┐       ┌─────────┐
   │Cliente A│       │Cliente B│       │Cliente C│
   │role:    │       │role:    │       │role:    │
   │"client" │       │"client" │       │"client" │
   └─────────┘       └─────────┘       └─────────┘
        │                  │                  │
        │ Vê APENAS:       │ Vê APENAS:       │ Vê APENAS:
        │ - Seus contatos  │ - Seus contatos  │ - Seus contatos
        │ - Suas conversas │ - Suas conversas │ - Suas conversas
        │ - Suas tarefas   │ - Suas tarefas   │ - Suas tarefas
        └──────────────────┴──────────────────┘
```

### Como funciona o isolamento:

#### 1. **Nível de Banco de Dados**

Toda query deve incluir automaticamente o filtro:

```typescript
// Para role "client"
where: {
  OR: [
    { created_by: session.user.id },
    { assigned_to: session.user.id }
  ]
}

// Para role "agency"
where: {} // Sem filtros, vê tudo
```

#### 2. **Middleware de Autorização** (já implementado em `lib/auth-helpers.ts`)

```typescript
// ✅ JÁ EXISTE
export function getRoleBasedFilters(session) {
  if (isAgency(session)) {
    return {}; // Vê tudo
  }
  
  // Client vê apenas o que criou ou foi atribuído a ele
  return {
    OR: [
      { created_by: session.user.id },
      { assigned_to: session.user.id }
    ]
  };
}
```

#### 3. **Exemplo em Actions**

```typescript
// actions/crm/get-contacts.ts
export const getContacts = async () => {
  const session = await getServerSession(authOptions);
  const roleFilters = getRoleBasedFilters(session); // ✅ JÁ IMPLEMENTADO
  
  const contacts = await prismadb.crm_Contacts.findMany({
    where: {
      ...roleFilters, // Aplica filtro automático
    }
  });
  
  return contacts;
}
```

---

## 📱 PARTE 3: INTEGRAÇÃO EVOLUTION API WHATSAPP (Multi-Instância)

### Problema Atual:

```env
# .env.local (ATUAL - 1 única instância global)
EVOLUTION_API_URL="http://localhost:8080"
EVOLUTION_API_KEY="sua-chave-global"
EVOLUTION_INSTANCE_NAME="balako-crm"
```

❌ **Problema:** Todos os clientes usam a MESMA conta WhatsApp  
❌ **Risco:** Cliente A vê conversas do Cliente B

### Solução Proposta: Multi-Instância

#### 1. **Adicionar tabela `WhatsAppConfigs` no schema**

```prisma
model WhatsAppConfig {
  id                String   @id @default(uuid())
  userId            String   @unique // Cliente dono desta config
  evolutionApiUrl   String   // URL da API Evolution
  evolutionApiKey   String   // API Key
  instanceName      String   // Nome da instância
  phoneNumber       String?  // Número conectado
  status            String   @default("DISCONNECTED") // CONNECTED/DISCONNECTED
  qrCode            String?  // QR Code para conexão
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  user              Users    @relation(fields: [userId], references: [id])
  
  @@index([userId])
}
```

#### 2. **Atualizar `lib/whatsapp.ts` para Multi-Tenant**

```typescript
// ANTES (atual - usa .env global)
export async function sendWhatsAppMessage(
  phone: string,
  message: string
): Promise<boolean> {
  const apiUrl = process.env.EVOLUTION_API_URL; // ❌ Global
  const apiKey = process.env.EVOLUTION_API_KEY;
  const instance = process.env.EVOLUTION_INSTANCE_NAME;
  // ...
}

// DEPOIS (multi-tenant - usa config do cliente)
export async function sendWhatsAppMessage(
  userId: string, // ✅ ID do cliente
  phone: string,
  message: string
): Promise<boolean> {
  // Busca configuração específica do cliente
  const config = await prismadb.whatsAppConfig.findUnique({
    where: { userId }
  });
  
  if (!config) {
    throw new Error("WhatsApp não configurado para este cliente");
  }
  
  const apiUrl = config.evolutionApiUrl;
  const apiKey = config.evolutionApiKey;
  const instance = config.instanceName;
  
  // Resto do código igual...
}
```

#### 3. **Criar página de configuração WhatsApp**

**Nova página:** `/settings/whatsapp`

```typescript
// app/[locale]/(routes)/settings/whatsapp/page.tsx
export default async function WhatsAppSettingsPage() {
  const session = await getServerSession(authOptions);
  
  // Agency pode configurar para qualquer cliente
  // Client só pode configurar para si mesmo
  
  const config = await prismadb.whatsAppConfig.findUnique({
    where: { userId: session.user.id }
  });
  
  return (
    <Container title="Configurar WhatsApp">
      <WhatsAppConfigForm config={config} />
    </Container>
  );
}
```

#### 4. **Formulário de Configuração**

Campos necessários:
- **Evolution API URL** (ex: `https://evolution.seudominio.com`)
- **Evolution API Key** (gerada na Evolution API)
- **Nome da Instância** (ex: `cliente-marca-xyz`)
- **Status da Conexão** (automático)
- **Botão "Conectar WhatsApp"** (mostra QR Code)

#### 5. **Fluxo de Conexão**

```
1. Cliente vai em /settings/whatsapp
2. Preenche: API URL, API Key, Nome da Instância
3. Clica em "Conectar WhatsApp"
4. Sistema chama Evolution API para criar instância
5. Evolution retorna QR Code
6. Cliente escaneia QR Code com WhatsApp
7. Evolution notifica quando conectado (webhook)
8. Sistema atualiza status para "CONNECTED"
9. Agora cliente pode enviar mensagens!
```

---

## 🔧 PARTE 4: IMPLEMENTAÇÃO PASSO A PASSO

### Fase 1: Adicionar campo "Role" na tabela de usuários (Admin)

1. Editar `app/[locale]/(routes)/admin/users/table-components/columns.tsx`
2. Adicionar coluna após "Email":

```typescript
{
  accessorKey: "role",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Role" />
  ),
  cell: ({ row }) => {
    const role = row.getValue("role") as string;
    return (
      <div className="flex items-center">
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          role === 'agency' 
            ? 'bg-[#21808D]/10 text-[#21808D]' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          {role === 'agency' ? '👑 Agência' : '👤 Cliente'}
        </span>
      </div>
    );
  },
  enableSorting: true,
  enableHiding: true,
}
```

### Fase 2: Criar Tabela WhatsAppConfig

1. Adicionar model no `prisma/schema.prisma`
2. Executar `npx prisma db push`
3. Criar migration

### Fase 3: Criar Actions de WhatsApp Config

```typescript
// actions/whatsapp/create-config.ts
// actions/whatsapp/update-config.ts
// actions/whatsapp/get-config.ts
// actions/whatsapp/generate-qr-code.ts
// actions/whatsapp/check-connection-status.ts
```

### Fase 4: Criar Página de Configuração WhatsApp

```
app/[locale]/(routes)/settings/whatsapp/
├── page.tsx
├── components/
│   ├── WhatsAppConfigForm.tsx
│   ├── QRCodeDisplay.tsx
│   └── ConnectionStatus.tsx
```

### Fase 5: Atualizar SendWhatsAppModal

Modificar para usar config do cliente:
```typescript
// components/SendWhatsAppModal.tsx
const sendMessage = async () => {
  await sendWhatsAppMessage(
    session.user.id, // ✅ Usa config do cliente
    phone,
    message
  );
}
```

### Fase 6: Dashboard Diferenciado por Role

**Agency Dashboard:**
- Widget: Total de clientes
- Widget: Mensagens WhatsApp (TODOS os clientes)
- Widget: Follow-ups (TODOS os clientes)
- Lista de clientes com métricas individuais

**Client Dashboard:**
- Widget: Seus contatos
- Widget: Suas mensagens WhatsApp
- Widget: Seus follow-ups pendentes
- Sem acesso a dados de outros clientes

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Alta Prioridade (Segurança Crítica)

- [ ] Adicionar coluna "Role" na tabela de usuários do admin
- [ ] Criar model `WhatsAppConfig` no schema
- [ ] Implementar página `/settings/whatsapp` para configuração
- [ ] Atualizar `lib/whatsapp.ts` para buscar config do cliente
- [ ] Testar isolamento de dados entre clientes

### Média Prioridade (Funcionalidade)

- [ ] Criar actions de WhatsApp config (CRUD)
- [ ] Implementar geração de QR Code
- [ ] Criar webhook para status de conexão
- [ ] Atualizar SendWhatsAppModal para multi-tenant
- [ ] Adicionar verificação de status da conexão

### Baixa Prioridade (UX/UI)

- [ ] Dashboard diferenciado por role
- [ ] Widget de status WhatsApp no header
- [ ] Notificações de desconexão WhatsApp
- [ ] Logs de mensagens enviadas por cliente
- [ ] Relatório de uso por cliente (para agency)

---

## 🔒 SEGURANÇA E CONSIDERAÇÕES

### Regras de Ouro:

1. **NUNCA** retornar dados de outros clientes para usuários com role "client"
2. **SEMPRE** aplicar `getRoleBasedFilters()` em TODAS as queries
3. **NUNCA** confiar apenas em validações do front-end
4. **SEMPRE** validar role no servidor (API routes e Server Actions)
5. **NUNCA** expor credenciais WhatsApp no front-end

### Exemplo de validação:

```typescript
// ✅ CORRETO
export async function deleteContact(contactId: string) {
  const session = await getServerSession(authOptions);
  
  // 1. Verifica se está autenticado
  if (!session?.user) {
    throw new Error("Não autenticado");
  }
  
  // 2. Busca o contato
  const contact = await prismadb.crm_Contacts.findUnique({
    where: { id: contactId }
  });
  
  // 3. Verifica permissão
  if (!canAccessResource(session, contact.created_by)) {
    throw new Error("Sem permissão");
  }
  
  // 4. Agora sim pode deletar
  await prismadb.crm_Contacts.delete({ where: { id: contactId } });
}
```

---

## 🎯 PRÓXIMOS PASSOS RECOMENDADOS

### Imediato (Hoje):
1. ✅ Adicionar coluna "Role" na tabela admin
2. ✅ Criar model `WhatsAppConfig`
3. ✅ Fazer push do schema

### Esta Semana:
4. Criar página `/settings/whatsapp`
5. Implementar conexão Evolution API multi-tenant
6. Testar isolamento de dados

### Próxima Semana:
7. Dashboard diferenciado por role
8. Webhooks de status WhatsApp
9. Logs e relatórios

---

## 📞 SUPORTE

Dúvidas sobre implementação? Consulte:
- `lib/auth-helpers.ts` - Funções de autorização
- `lib/whatsapp.ts` - Integração Evolution API
- `SETUP_GUIDE.md` - Guia de configuração geral

**Autor:** GitHub Copilot  
**Revisão:** Necessária antes de produção
