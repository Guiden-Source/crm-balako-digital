import { prismadb } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getRoleBasedFilters } from "@/lib/auth-helpers";

/**
 * Busca todas as oportunidades com filtros baseados no role do usuário
 * 
 * - Agency: retorna TODAS as oportunidades
 * - Client: retorna APENAS as oportunidades onde ownerId === user.id
 * - Não autenticado: retorna array vazio
 */
export const getOpportunities = async () => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      console.warn("[GET_OPPORTUNITIES_ACTION] Unauthenticated access attempt");
      return [];
    }

    // Aplicar filtros baseados no role
    const roleFilters = getRoleBasedFilters(session);

    const data = await prismadb.crm_Opportunities.findMany({
      where: {
        ...roleFilters,
      },
      include: {
        assigned_account: {
          select: {
            id: true,
            name: true,
          },
        },
        assigned_sales_stage: {
          select: {
            id: true,
            name: true,
            probability: true,
            value: true,
          },
        },
        assigned_to_user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        contacts: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
      orderBy: {
        cratedAt: "desc",
      },
    });

    return data;
  } catch (error) {
    console.error("[GET_OPPORTUNITIES_ACTION_ERROR]", error);
    return [];
  }
};
