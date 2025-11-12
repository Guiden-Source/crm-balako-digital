import { prismadb } from "@/lib/prisma";

/**
 * Conta mensagens WhatsApp enviadas hoje
 * 
 * @returns Número de mensagens enviadas hoje
 */
export async function getWhatsAppMessagesToday(): Promise<number> {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const count = await prismadb.whatsAppMessage.count({
      where: {
        sentAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return count;
  } catch (error) {
    console.error("[GET_WHATSAPP_TODAY] Error:", error);
    return 0;
  }
}
