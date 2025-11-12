/**
 * EXEMPLOS DE USO - auth-helpers.ts
 * 
 * Este arquivo contém exemplos práticos de como usar as funções
 * de autorização do Balako Digital CRM
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  isAgency,
  isClient,
  requireAgency,
  getUserRole,
  canAccessResource,
  getRoleBasedFilters,
  UnauthorizedError,
} from "@/lib/auth-helpers";
import { prismadb } from "@/lib/prisma";

// ============================================================================
// EXEMPLO 1: Verificar role do usuário
// ============================================================================

export async function exampleCheckRole() {
  const session = await getServerSession(authOptions);

  if (isAgency(session)) {
    console.log("👔 Usuário é uma AGÊNCIA - acesso total");
  } else if (isClient(session)) {
    console.log("👤 Usuário é um CLIENTE - acesso limitado");
  } else {
    console.log("🚫 Usuário não autenticado");
  }
}

// ============================================================================
// EXEMPLO 2: API Route protegida por role AGENCY
// ============================================================================

export async function deleteContactAPI(contactId: string) {
  const session = await getServerSession(authOptions);

  try {
    // Lança erro se não for agency
    requireAgency(session);

    // Se chegou aqui, é uma agência
    await prismadb.crm_Contacts.delete({
      where: { id: contactId },
    });

    return { success: true, message: "Contato deletado" };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return { success: false, message: error.message };
    }
    throw error;
  }
}

// ============================================================================
// EXEMPLO 3: Listar contatos com filtro baseado em role
// ============================================================================

export async function listContactsAPI() {
  const session = await getServerSession(authOptions);

  // Aplica filtros automaticamente baseado no role
  const roleFilters = getRoleBasedFilters(session);

  const contacts = await prismadb.crm_Contacts.findMany({
    where: {
      ...roleFilters, // Se client, filtra por ownerId automaticamente
      status: true, // outros filtros
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return contacts;
}

// ============================================================================
// EXEMPLO 4: Verificar permissão antes de editar
// ============================================================================

export async function updateContactAPI(contactId: string, data: any) {
  const session = await getServerSession(authOptions);

  // Buscar contato
  const contact = await prismadb.crm_Contacts.findUnique({
    where: { id: contactId },
  });

  if (!contact) {
    return { success: false, message: "Contato não encontrado" };
  }

  // Verificar se usuário pode acessar este contato
  if (!canAccessResource(session, contact.assigned_to || "")) {
    return {
      success: false,
      message: "Você não tem permissão para editar este contato",
    };
  }

  // Atualizar contato
  const updated = await prismadb.crm_Contacts.update({
    where: { id: contactId },
    data,
  });

  return { success: true, data: updated };
}

// ============================================================================
// EXEMPLO 5: Dashboard com dados filtrados por role
// ============================================================================

export async function getDashboardData() {
  const session = await getServerSession(authOptions);
  const role = getUserRole(session);

  console.log(`Carregando dashboard para role: ${role}`);

  // Filtros baseados em role
  const filters = getRoleBasedFilters(session);

  // Buscar métricas
  const [contactsCount, tasksCount, opportunitiesCount] = await Promise.all([
    prismadb.crm_Contacts.count({ where: filters }),
    prismadb.tasks.count({ where: { user: session?.user?.id } }),
    prismadb.crm_Opportunities.count({ where: filters }),
  ]);

  if (isAgency(session)) {
    // Dashboard completo para agências
    return {
      role: "agency",
      metrics: {
        totalContacts: contactsCount,
        totalTasks: tasksCount,
        totalOpportunities: opportunitiesCount,
        // Métricas adicionais para agências...
      },
    };
  } else {
    // Dashboard simplificado para clientes
    return {
      role: "client",
      metrics: {
        myContacts: contactsCount,
        myTasks: tasksCount,
        myOpportunities: opportunitiesCount,
      },
    };
  }
}

// ============================================================================
// EXEMPLO 6: Server Action com autorização
// ============================================================================

export async function sendWhatsAppMessageAction(
  contactId: string,
  message: string
) {
  const session = await getServerSession(authOptions);

  // Buscar contato
  const contact = await prismadb.crm_Contacts.findUnique({
    where: { id: contactId },
  });

  if (!contact) {
    throw new Error("Contato não encontrado");
  }

  // Verificar permissão
  if (!canAccessResource(session, contact.assigned_to || "")) {
    throw new UnauthorizedError(
      "Você não tem permissão para enviar mensagens para este contato"
    );
  }

  // Verificar se contato tem WhatsApp
  if (!contact.mobile_phone) {
    throw new Error("Contato não possui número de WhatsApp");
  }

  // Enviar mensagem via Evolution API
  // ... código de envio ...

  // Registrar mensagem enviada
  await prismadb.whatsAppMessage.create({
    data: {
      contactId: contact.id,
      phone: contact.mobile_phone,
      message,
      status: "sent",
      sentBy: session!.user.id,
      sentAt: new Date(),
    },
  });

  return { success: true, message: "Mensagem enviada com sucesso" };
}

// ============================================================================
// EXEMPLO 7: Middleware para proteger rotas
// ============================================================================

export async function protectRoute(requiredRole: "agency" | "client" | null) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new UnauthorizedError("Você precisa estar autenticado");
  }

  if (requiredRole === "agency") {
    requireAgency(session);
  }

  return session;
}

// ============================================================================
// EXEMPLO 8: Component Server-Side com role check
// ============================================================================

export async function ContactsPageComponent() {
  const session = await getServerSession(authOptions);

  if (isAgency(session)) {
    // Renderizar view de agência
    return (
      <div>
        <h1>Todos os Contatos (Agência)</h1>
        {/* Lista completa de todos os contatos */}
      </div>
    );
  } else {
    // Renderizar view de cliente
    return (
      <div>
        <h1>Meus Contatos</h1>
        {/* Lista apenas dos contatos do cliente */}
      </div>
    );
  }
}
