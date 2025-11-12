# API de Contatos - Documentação

## Autorização por Roles

A API de contatos implementa controle de acesso baseado em roles (`agency` e `client`).

---

## 📌 Endpoints

### `GET /api/crm/contacts`
Lista contatos com filtros baseados no role do usuário.

**Autenticação:** Obrigatória

**Comportamento por Role:**
- **Agency:** Retorna TODOS os contatos do sistema
- **Client:** Retorna APENAS contatos onde `ownerId === user.id`

**Response:**
```json
{
  "contacts": [
    {
      "id": "uuid",
      "first_name": "João",
      "last_name": "Silva",
      "email": "joao@example.com",
      "mobile_phone": "+5511999999999",
      "assigned_to": "user-id",
      "assigned_to_user": {
        "id": "user-id",
        "name": "User Name",
        "email": "user@example.com"
      }
    }
  ],
  "meta": {
    "total": 10,
    "role": "agency"
  }
}
```

**Status Codes:**
- `200` - Sucesso
- `401` - Não autenticado
- `500` - Erro interno

---

### `POST /api/crm/contacts`
Cria um novo contato.

**Autenticação:** Obrigatória

**Permissões:**
- ✅ **Agency:** Pode criar contatos
- ✅ **Client:** Pode criar contatos

**Request Body:**
```json
{
  "first_name": "João",
  "last_name": "Silva",
  "email": "joao@example.com",
  "personal_email": "joao.pessoal@example.com",
  "mobile_phone": "+5511999999999",
  "office_phone": "+5511888888888",
  "assigned_to": "user-id",
  "assigned_account": "account-id",
  "birthday_day": "15",
  "birthday_month": "06",
  "birthday_year": "1990",
  "description": "Descrição do contato",
  "website": "https://example.com",
  "status": true,
  "type": "Customer",
  "social_twitter": "@joao",
  "social_facebook": "joao.silva",
  "social_linkedin": "joao-silva",
  "social_instagram": "@joao",
  "social_youtube": "@joao",
  "social_tiktok": "@joao",
  "social_skype": "joao.silva"
}
```

**Response:**
```json
{
  "newContact": {
    "id": "uuid",
    "first_name": "João",
    "last_name": "Silva",
    // ... outros campos
  }
}
```

**Status Codes:**
- `200` - Contato criado com sucesso
- `400` - Dados inválidos
- `401` - Não autenticado
- `500` - Erro interno

---

### `PUT /api/crm/contacts`
Atualiza um contato existente.

**Autenticação:** Obrigatória

**Permissões:**
- ✅ **Agency:** Pode editar qualquer contato
- ⚠️ **Client:** Pode editar APENAS seus próprios contatos (assigned_to === user.id)

**Request Body:**
```json
{
  "id": "contact-id",
  "first_name": "João Updated",
  "last_name": "Silva",
  // ... outros campos para atualizar
}
```

**Response:**
```json
{
  "newContact": {
    "id": "uuid",
    "first_name": "João Updated",
    // ... campos atualizados
  }
}
```

**Status Codes:**
- `200` - Contato atualizado com sucesso
- `400` - Dados inválidos
- `401` - Não autenticado
- `403` - Sem permissão para editar este contato
- `404` - Contato não encontrado
- `500` - Erro interno

---

### `DELETE /api/crm/contacts?id={contact-id}`
Deleta um contato (APENAS para agências).

**Autenticação:** Obrigatória

**Permissões:**
- ✅ **Agency:** Pode deletar qualquer contato
- ❌ **Client:** NÃO pode deletar contatos

**Query Parameters:**
- `id` (obrigatório) - ID do contato a ser deletado

**Response:**
```json
{
  "success": true,
  "message": "Contato deletado com sucesso"
}
```

**Status Codes:**
- `200` - Contato deletado com sucesso
- `400` - ID não fornecido
- `401` - Não autenticado
- `403` - Apenas agências podem deletar contatos
- `404` - Contato não encontrado
- `500` - Erro interno

---

## 🔐 Autenticação

Todas as rotas requerem autenticação via NextAuth. A sessão deve conter:

```typescript
{
  user: {
    id: string;
    email: string;
    name: string;
    role: "agency" | "client"; // Campo obrigatório
  }
}
```

---

## 🎯 Exemplos de Uso

### Listar contatos (Client vs Agency)

**Client (vê apenas seus contatos):**
```typescript
const response = await fetch('/api/crm/contacts', {
  headers: {
    'Cookie': session.cookie // User role: client
  }
});
// Retorna apenas contatos onde assigned_to === client.id
```

**Agency (vê todos os contatos):**
```typescript
const response = await fetch('/api/crm/contacts', {
  headers: {
    'Cookie': session.cookie // User role: agency
  }
});
// Retorna TODOS os contatos do sistema
```

### Criar contato

```typescript
const response = await fetch('/api/crm/contacts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    first_name: 'João',
    last_name: 'Silva',
    email: 'joao@example.com',
    mobile_phone: '+5511999999999',
    assigned_to: session.user.id,
  }),
});
```

### Atualizar contato (com validação de permissão)

```typescript
// Client tentando editar contato de outro usuário
const response = await fetch('/api/crm/contacts', {
  method: 'PUT',
  body: JSON.stringify({
    id: 'outro-contato-id',
    first_name: 'Novo Nome',
  }),
});
// Response: 403 Forbidden - "Você não tem permissão para editar este contato"
```

### Deletar contato (apenas agency)

```typescript
// Agency deletando contato
const response = await fetch('/api/crm/contacts?id=contact-123', {
  method: 'DELETE',
});
// Response: 200 OK

// Client tentando deletar contato
const response = await fetch('/api/crm/contacts?id=contact-123', {
  method: 'DELETE',
});
// Response: 403 Forbidden - "Apenas agências têm permissão para deletar contatos"
```

---

## 📊 Logs

Todas as operações são logadas no console para auditoria:

```
[GET_CONTACTS] User role: agency, User ID: user-123
[GET_CONTACTS] Agency view - returned 150 contacts

[GET_CONTACTS] User role: client, User ID: user-456
[GET_CONTACTS] Client view - returned 20 contacts for user user-456

[CREATE_CONTACT] Created by user user-123 with role: agency
[UPDATE_CONTACT] Updated by user user-456 with role: client
[DELETE_CONTACT] Contact contact-789 deleted by agency user user-123
```

---

## 🛠️ Funções Helper Utilizadas

A API usa as seguintes funções de `lib/auth-helpers.ts`:

- `getRoleBasedFilters(session)` - Gera filtros para queries baseados no role
- `getUserRole(session)` - Retorna o role do usuário
- `isAgency(session)` - Verifica se o usuário é agency
- `isClient(session)` - Verifica se o usuário é client

---

## ⚠️ Tratamento de Erros

Todos os endpoints retornam erros no formato:

```json
{
  "error": "Error Type",
  "message": "Mensagem descritiva em português"
}
```

**Tipos de erro:**
- `Unauthorized` - Não autenticado (401)
- `Forbidden` - Sem permissão (403)
- `Bad Request` - Dados inválidos (400)
- `Not Found` - Recurso não encontrado (404)
- `Internal Server Error` - Erro no servidor (500)
