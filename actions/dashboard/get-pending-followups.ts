import { prismadb } from "@/lib/prisma";

/**
 * Conta follow-ups (tasks) pendentes com vencimento hoje ou atrasados
 * 
 * @returns Número de tasks não completadas com dueDate <= hoje
 */
export async function getPendingFollowUps(): Promise<number> {
  try {
    const today = new Date();
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    const count = await prismadb.tasks.count({
      where: {
        dueDateAt: {
          lte: endOfToday,
        },
        taskStatus: {
          not: "COMPLETE",
        },
      },
    });

    return count;
  } catch (error) {
    console.error("[GET_PENDING_FOLLOWUPS] Error:", error);
    return 0;
  }
}
