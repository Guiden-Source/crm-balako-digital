import { NextResponse } from "next/server";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import sendEmailOriginal from "@/lib/sendmail";
import { prismadb } from "@/lib/prisma";

/**
 * Wrapper para sendEmail com formato de resposta consistente
 */
async function sendEmail(params: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    await sendEmailOriginal({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USERNAME,
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Interface para estatísticas do processamento
 */
interface ProcessingStats {
  tasksFound: number;
  tasksProcessed: number;
  whatsappSent: number;
  whatsappFailed: number;
  emailSent: number;
  emailFailed: number;
  errors: string[];
}

/**
 * GET /api/cron/check-tasks
 * 
 * Cron job que verifica tasks com vencimento hoje e envia notificações
 * via WhatsApp e/ou Email se ainda não foram enviadas
 * 
 * Segurança: Requer Authorization header com Bearer token (CRON_SECRET)
 * 
 * @returns 200 - Tasks processadas com sucesso
 * @returns 401 - Não autorizado (token inválido)
 * @returns 500 - Erro no servidor
 * 
 * @example
 * ```bash
 * curl -X GET https://yourapp.com/api/cron/check-tasks \
 *   -H "Authorization: Bearer seu-cron-secret"
 * ```
 */
export async function GET(req: Request) {
  const startTime = Date.now();
  console.log("\n========================================");
  console.log("[CRON] Task notification check started");
  console.log("========================================\n");

  try {
    // 1. Validar CRON_SECRET no header Authorization
    const authHeader = req.headers.get("Authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      console.error("[CRON] ✗ CRON_SECRET not configured in environment");
      return NextResponse.json(
        { error: "CRON_SECRET não configurado no servidor" },
        { status: 500 }
      );
    }

    if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
      console.warn("[CRON] ✗ Unauthorized access attempt");
      console.warn(`[CRON] Expected: Bearer ${cronSecret.substring(0, 10)}...`);
      console.warn(`[CRON] Received: ${authHeader?.substring(0, 30)}...`);
      return NextResponse.json(
        { error: "Não autorizado. Token inválido." },
        { status: 401 }
      );
    }

    console.log("[CRON] ✓ Authorization validated");

    // 2. Definir range de hoje (00:00 até 23:59)
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    console.log(`[CRON] Date range: ${startOfDay.toISOString()} to ${endOfDay.toISOString()}`);

    // 3. Buscar tasks que precisam de notificação
    console.log("[CRON] Querying database for tasks...");
    
    const tasks = await prismadb.tasks.findMany({
      where: {
        dueDateAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
  notificationSent: false,
  taskStatus: { not: "COMPLETED" },
      },
      include: {
        assigned_user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        crm_Contacts: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        dueDate: "asc",
      },
    });

    console.log(`[CRON] ✓ Found ${tasks.length} tasks to process\n`);

    if (tasks.length === 0) {
      const duration = Date.now() - startTime;
      console.log("[CRON] No tasks to process. Job completed.");
      console.log(`[CRON] Duration: ${duration}ms\n`);
      return NextResponse.json({
        success: true,
        message: "No tasks to process",
        tasksProcessed: 0,
        duration: `${duration}ms`,
      });
    }

    // 4. Estatísticas de processamento
    const stats: ProcessingStats = {
      tasksFound: tasks.length,
      tasksProcessed: 0,
      whatsappSent: 0,
      whatsappFailed: 0,
      emailSent: 0,
      emailFailed: 0,
      errors: [],
    };

    // 5. Processar cada task
    for (const task of tasks) {
      console.log(`\n--- Processing Task: ${task.id} ---`);
      console.log(`[CRON] Title: ${task.title}`);
      console.log(`[CRON] Due Date: ${task.dueDate}`);
      console.log(`[CRON] Assigned to: ${task.assigned_user?.name || "Unassigned"}`);
      console.log(`[CRON] Contact: ${task.crm_Contacts?.name || "No contact"}`);
      console.log(`[CRON] Notify via WhatsApp: ${task.notifyViaWhatsApp}`);
      console.log(`[CRON] Notify via Email: ${task.notifyViaEmail}`);

      let whatsappSent = false;
      let emailSent = false;

      // 5a. Enviar WhatsApp se habilitado e houver contato com telefone
      if (task.notifyViaWhatsApp && task.crm_Contacts?.phone) {
        console.log(`[CRON] 📱 Sending WhatsApp to ${task.crm_Contacts.phone}...`);
        
        try {
          const message = formatWhatsAppMessage(task, task.crm_Contacts.name);
          const result = await sendWhatsAppMessage(
            task.crm_Contacts.phone,
            message
          );

          if (result.success) {
            console.log(`[CRON] ✓ WhatsApp sent successfully`);
            stats.whatsappSent++;
            whatsappSent = true;
          } else {
            console.error(`[CRON] ✗ WhatsApp failed:`, result.error);
            stats.whatsappFailed++;
            stats.errors.push(
              `Task ${task.id}: WhatsApp failed - ${result.error}`
            );
          }
        } catch (error) {
          console.error(`[CRON] ✗ WhatsApp error:`, error);
          stats.whatsappFailed++;
          stats.errors.push(
            `Task ${task.id}: WhatsApp exception - ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }
      } else if (task.notifyViaWhatsApp) {
        console.log(
          `[CRON] ⚠️ WhatsApp notification skipped (no contact phone)`
        );
      }

      // 5b. Enviar Email se habilitado e houver usuário com email
      if (task.notifyViaEmail && task.assigned_user?.email) {
        console.log(`[CRON] 📧 Sending email to ${task.assigned_user.email}...`);
        
        try {
          const emailData = formatEmailMessage(task, task.assigned_user.name);
          const result = await sendEmail({
            to: task.assigned_user.email,
            subject: emailData.subject,
            text: emailData.text,
            html: emailData.html,
          });

          if (result.success) {
            console.log(`[CRON] ✓ Email sent successfully`);
            stats.emailSent++;
            emailSent = true;
          } else {
            console.error(`[CRON] ✗ Email failed:`, result.error);
            stats.emailFailed++;
            stats.errors.push(
              `Task ${task.id}: Email failed - ${result.error}`
            );
          }
        } catch (error) {
          console.error(`[CRON] ✗ Email error:`, error);
          stats.emailFailed++;
          stats.errors.push(
            `Task ${task.id}: Email exception - ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }
      } else if (task.notifyViaEmail) {
        console.log(
          `[CRON] ⚠️ Email notification skipped (no user email)`
        );
      }

      // 5c. Marcar notificationSent = true se pelo menos uma notificação foi enviada
      if (whatsappSent || emailSent) {
        try {
          await prismadb.tasks.update({
            where: { id: task.id },
            data: { notificationSent: true },
          });
          console.log(`[CRON] ✓ Task marked as notified`);
          stats.tasksProcessed++;
        } catch (error) {
          console.error(`[CRON] ✗ Failed to update task:`, error);
          stats.errors.push(
            `Task ${task.id}: Failed to update notificationSent flag`
          );
        }
      } else {
        console.log(`[CRON] ⚠️ No notifications sent for this task`);
      }
    }

    // 6. Finalizar e retornar resultado
    const duration = Date.now() - startTime;
    
    console.log("\n========================================");
    console.log("[CRON] Task notification check completed");
    console.log("========================================");
    console.log(`[CRON] Tasks found: ${stats.tasksFound}`);
    console.log(`[CRON] Tasks processed: ${stats.tasksProcessed}`);
    console.log(`[CRON] WhatsApp sent: ${stats.whatsappSent}`);
    console.log(`[CRON] WhatsApp failed: ${stats.whatsappFailed}`);
    console.log(`[CRON] Email sent: ${stats.emailSent}`);
    console.log(`[CRON] Email failed: ${stats.emailFailed}`);
    console.log(`[CRON] Errors: ${stats.errors.length}`);
    console.log(`[CRON] Duration: ${duration}ms`);
    
    if (stats.errors.length > 0) {
      console.log("\n[CRON] Errors encountered:");
      stats.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }
    
    console.log("\n");

    return NextResponse.json({
      success: true,
      message: "Task notifications processed",
      stats: {
        tasksFound: stats.tasksFound,
        tasksProcessed: stats.tasksProcessed,
        whatsappSent: stats.whatsappSent,
        whatsappFailed: stats.whatsappFailed,
        emailSent: stats.emailSent,
        emailFailed: stats.emailFailed,
        totalErrors: stats.errors.length,
      },
      errors: stats.errors.length > 0 ? stats.errors : undefined,
      duration: `${duration}ms`,
    });
  } catch (error) {
    console.error("\n[CRON] ✗ Fatal error:", error);
    console.error("[CRON] Stack:", error instanceof Error ? error.stack : "N/A");
    
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno no processamento de notificações",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Formata mensagem de WhatsApp para notificação de task
 */
function formatWhatsAppMessage(
  task: any,
  contactName: string | null
): string {
  const dueDate = new Date(task.dueDate).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const dueTime = new Date(task.dueDate).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `🔔 *Lembrete de Task*

Olá${contactName ? ` ${contactName}` : ""}! 👋

Você tem uma task agendada para hoje:

📋 *${task.title}*
${task.description ? `\n${task.description}\n` : ""}
📅 Data: ${dueDate}
🕐 Hora: ${dueTime}

Por favor, não esqueça de completar esta task.

_Mensagem automática do Balako Digital CRM_`;
}

/**
 * Formata mensagem de email para notificação de task
 */
function formatEmailMessage(
  task: any,
  userName: string | null
): { subject: string; text: string; html: string } {
  const dueDate = new Date(task.dueDate).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const dueTime = new Date(task.dueDate).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const subject = `🔔 Lembrete: ${task.title}`;

  const text = `Olá${userName ? ` ${userName}` : ""}!

Você tem uma task agendada para hoje:

Título: ${task.title}
${task.description ? `Descrição: ${task.description}\n` : ""}
Data: ${dueDate}
Hora: ${dueTime}

Por favor, não esqueça de completar esta task.

---
Mensagem automática do Balako Digital CRM`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }
    .header {
      background-color: #21808D;
      color: white;
      padding: 20px;
      border-radius: 8px 8px 0 0;
      text-align: center;
    }
    .content {
      padding: 20px;
      background-color: #f9f9f9;
    }
    .task-info {
      background-color: white;
      padding: 15px;
      border-left: 4px solid #F59E0B;
      margin: 15px 0;
    }
    .footer {
      text-align: center;
      padding: 15px;
      color: #666;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🔔 Lembrete de Task</h2>
    </div>
    <div class="content">
      <p>Olá${userName ? ` <strong>${userName}</strong>` : ""}! 👋</p>
      <p>Você tem uma task agendada para hoje:</p>
      
      <div class="task-info">
        <h3>📋 ${task.title}</h3>
        ${task.description ? `<p>${task.description}</p>` : ""}
        <p><strong>📅 Data:</strong> ${dueDate}</p>
        <p><strong>🕐 Hora:</strong> ${dueTime}</p>
      </div>
      
      <p>Por favor, não esqueça de completar esta task.</p>
    </div>
    <div class="footer">
      <p>Mensagem automática do <strong>Balako Digital CRM</strong></p>
    </div>
  </div>
</body>
</html>
`;

  return { subject, text, html };
}

/**
 * POST não é suportado - apenas GET para cron jobs
 */
export async function POST() {
  return NextResponse.json(
    { error: "Método não permitido. Use GET." },
    { status: 405 }
  );
}
