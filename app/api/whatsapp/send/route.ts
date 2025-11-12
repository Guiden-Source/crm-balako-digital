import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { sendWhatsAppMessage, formatPhoneNumber } from "@/lib/whatsapp";
import { prismadb } from "@/lib/prisma";

/**
 * Interface para o body da requisição
 */
interface SendWhatsAppRequest {
  phone: string;
  message: string;
  contactId?: string;
}

/**
 * POST /api/whatsapp/send
 * 
 * Envia uma mensagem via WhatsApp e registra no banco de dados
 * 
 * @body phone - Número de telefone do destinatário
 * @body message - Mensagem a ser enviada
 * @body contactId - ID do contato (opcional)
 * 
 * @returns 200 - Mensagem enviada com sucesso
 * @returns 400 - Dados inválidos
 * @returns 401 - Não autenticado
 * @returns 500 - Erro no servidor
 * 
 * @example
 * ```typescript
 * POST /api/whatsapp/send
 * {
 *   "phone": "(11) 99999-9999",
 *   "message": "Olá! Como posso ajudar?",
 *   "contactId": "550e8400-e29b-41d4-a716-446655440000"
 * }
 * ```
 */
export async function POST(req: Request) {
  try {
    // 1. Validar sessão
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.log("[WHATSAPP API] Unauthorized: No session found");
      return NextResponse.json(
        { error: "Não autenticado. Faça login para continuar." },
        { status: 401 }
      );
    }

    console.log(`[WHATSAPP API] Request from user: ${session.user.id}`);

    // 2. Parsear body da requisição
    let body: SendWhatsAppRequest;
    
    try {
      body = await req.json();
    } catch (error) {
      console.error("[WHATSAPP API] Invalid JSON:", error);
      return NextResponse.json(
        { error: "Body da requisição inválido. Envie um JSON válido." },
        { status: 400 }
      );
    }

    const { phone, message, contactId } = body;

    // 3. Validar campos obrigatórios
    if (!phone || typeof phone !== "string" || phone.trim().length === 0) {
      console.log("[WHATSAPP API] Validation error: Invalid phone");
      return NextResponse.json(
        { error: "Campo 'phone' é obrigatório e não pode estar vazio." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      console.log("[WHATSAPP API] Validation error: Invalid message");
      return NextResponse.json(
        { error: "Campo 'message' é obrigatório e não pode estar vazio." },
        { status: 400 }
      );
    }

    // 4. Validar contactId se fornecido
    if (contactId) {
      try {
        const contact = await prismadb.crm_Contacts.findUnique({
          where: { id: contactId },
        });

        if (!contact) {
          console.log(`[WHATSAPP API] Contact not found: ${contactId}`);
          return NextResponse.json(
            { error: "Contato não encontrado." },
            { status: 404 }
          );
        }

        console.log(`[WHATSAPP API] Contact validated: ${contact.name}`);
      } catch (error) {
        console.error("[WHATSAPP API] Error validating contact:", error);
        return NextResponse.json(
          { error: "Erro ao validar contato." },
          { status: 500 }
        );
      }
    }

    // 5. Formatar telefone
    let formattedPhone: string;
    
    try {
      formattedPhone = formatPhoneNumber(phone);
      console.log(`[WHATSAPP API] Phone formatted: ${phone} → ${formattedPhone}`);
    } catch (error) {
      console.error("[WHATSAPP API] Error formatting phone:", error);
      return NextResponse.json(
        { 
          error: "Número de telefone inválido. Use o formato brasileiro: (DDD) 99999-9999",
          details: error instanceof Error ? error.message : "Erro ao formatar telefone"
        },
        { status: 400 }
      );
    }

    // 6. Enviar mensagem via WhatsApp
    console.log(`[WHATSAPP API] Sending message to ${formattedPhone}`);
    const whatsappResult = await sendWhatsAppMessage(phone, message);

    // 7. Determinar status baseado no resultado
    const status = whatsappResult.success ? "sent" : "failed";
    
    console.log(`[WHATSAPP API] WhatsApp result: ${status}`, {
      success: whatsappResult.success,
      hasData: !!whatsappResult.data,
      hasError: !!whatsappResult.error,
    });

    // 8. Salvar no banco de dados
    let savedMessage;
    
    try {
      savedMessage = await prismadb.whatsAppMessage.create({
        data: {
          phone: formattedPhone,
          message: message.trim(),
          status,
          sentBy: session.user.id,
          contactId: contactId || null,
          sentAt: new Date(),
        },
        include: {
          contact: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      console.log(`[WHATSAPP API] Message saved to database: ${savedMessage.id}`);
    } catch (error) {
      console.error("[WHATSAPP API] Error saving to database:", error);
      
      // Se falhou ao salvar mas a mensagem foi enviada, ainda retornamos sucesso
      // mas avisamos sobre o problema de persistência
      if (whatsappResult.success) {
        return NextResponse.json(
          {
            success: true,
            warning: "Mensagem enviada, mas houve erro ao salvar no banco de dados.",
            whatsapp: whatsappResult.data,
          },
          { status: 200 }
        );
      }
      
      // Se tanto o envio quanto o salvamento falharam
      return NextResponse.json(
        { 
          error: "Erro ao processar mensagem.",
          details: error instanceof Error ? error.message : "Erro desconhecido"
        },
        { status: 500 }
      );
    }

    // 9. Retornar resultado
    if (whatsappResult.success) {
      console.log("[WHATSAPP API] ✓ Message sent and saved successfully");
      
      return NextResponse.json(
        {
          success: true,
          message: "Mensagem enviada com sucesso!",
          data: {
            id: savedMessage.id,
            phone: savedMessage.phone,
            message: savedMessage.message,
            status: savedMessage.status,
            sentAt: savedMessage.sentAt,
            contact: savedMessage.contact,
            sentBy: savedMessage.user,
          },
          whatsapp: whatsappResult.data,
        },
        { status: 200 }
      );
    } else {
      console.log("[WHATSAPP API] ✗ Message failed to send");
      
      return NextResponse.json(
        {
          success: false,
          message: "Falha ao enviar mensagem via WhatsApp.",
          error: whatsappResult.error,
          data: {
            id: savedMessage.id,
            status: savedMessage.status,
            savedAt: savedMessage.sentAt,
          },
        },
        { status: 500 }
      );
    }
  } catch (error) {
    // Erro inesperado no servidor
    console.error("[WHATSAPP API] Unexpected error:", error);
    
    return NextResponse.json(
      {
        error: "Erro interno no servidor.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/whatsapp/send
 * 
 * Retorna informações sobre o endpoint
 * 
 * @returns 200 - Informações do endpoint
 */
export async function GET() {
  return NextResponse.json(
    {
      endpoint: "/api/whatsapp/send",
      method: "POST",
      description: "Envia mensagens via WhatsApp usando Evolution API",
      authentication: "Required (NextAuth session)",
      body: {
        phone: "string (required) - Número de telefone brasileiro",
        message: "string (required) - Mensagem a ser enviada",
        contactId: "string (optional) - UUID do contato no banco de dados",
      },
      responses: {
        200: "Mensagem enviada com sucesso",
        400: "Dados inválidos (phone ou message vazios/inválidos)",
        401: "Não autenticado",
        404: "Contato não encontrado (se contactId fornecido)",
        500: "Erro no servidor ou falha no envio via WhatsApp",
      },
      example: {
        request: {
          phone: "(11) 99999-9999",
          message: "Olá! Como posso ajudar?",
          contactId: "550e8400-e29b-41d4-a716-446655440000",
        },
        response: {
          success: true,
          message: "Mensagem enviada com sucesso!",
          data: {
            id: "message-uuid",
            phone: "5511999999999@s.whatsapp.net",
            message: "Olá! Como posso ajudar?",
            status: "sent",
            sentAt: "2025-11-11T12:00:00.000Z",
            contact: { id: "...", name: "...", email: "..." },
            sentBy: { id: "...", name: "...", email: "..." },
          },
        },
      },
    },
    { status: 200 }
  );
}
