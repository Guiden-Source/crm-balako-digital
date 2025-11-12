import { prismadb } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getRoleBasedFilters, getUserRole } from "@/lib/auth-helpers";

/**
 * Busca contatos com filtros baseados no role do usuário
 * 
 * - Agency: retorna TODOS os contatos
 * - Client: retorna APENAS os contatos onde ownerId === user.id
 * - Não autenticado: retorna array vazio
 */
export const getContacts = async () => {
  try {
    const session = await getServerSession(authOptions);

    // Se não houver sessão, retornar array vazio
    if (!session?.user) {
      console.warn("[GET_CONTACTS_ACTION] Unauthenticated access attempt");
      return [];
    }

    const userRole = getUserRole(session);
    console.log(`[GET_CONTACTS_ACTION] User role: ${userRole}, User ID: ${session.user.id}`);

    // Aplicar filtros baseados no role
    const roleFilters = getRoleBasedFilters(session);

    const data = await prismadb.crm_Contacts.findMany({
      where: {
        ...roleFilters, // Se client, filtra por ownerId automaticamente
      },
      include: {
        assigned_to_user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        crate_by_user: {
          select: {
            id: true,
            name: true,
          },
        },
        assigned_accounts: true,
      },
      orderBy: {
        cratedAt: "desc", // Corrigido: createdAt → cratedAt (conforme schema)
      },
    });

    console.log(`[GET_CONTACTS_ACTION] Returned ${data.length} contacts for role: ${userRole}`);
    return data;
  } catch (error) {
    console.error("[GET_CONTACTS_ACTION_ERROR]", error);
    return [];
  }
};
