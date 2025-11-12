/**
 * Templates de mensagens WhatsApp para Balako Digital CRM
 * 
 * Este módulo contém templates pré-definidos para diferentes tipos de
 * comunicação via WhatsApp, mantendo consistência e profissionalismo.
 * 
 * @module whatsapp-templates
 */

/**
 * Interface para os templates de WhatsApp
 */
export interface WhatsAppTemplates {
  followUp: (name: string, context?: string) => string;
  reminder: (name: string, task: string, date?: string) => string;
  welcome: (name: string, companyName?: string) => string;
  custom: (name: string, customText: string) => string;
  taskNotification: (name: string, taskTitle: string, dueDate: string) => string;
  meetingConfirmation: (name: string, date: string, time: string) => string;
  thankYou: (name: string, reason?: string) => string;
  statusUpdate: (name: string, status: string, details?: string) => string;
}

/**
 * Templates de mensagens WhatsApp para diferentes situações
 * 
 * Todos os templates seguem as diretrizes:
 * - Tom profissional e amigável
 * - Emojis apropriados para cada contexto
 * - Assinatura "Balako Digital CRM"
 * - Formatação com quebras de linha (\n)
 * 
 * @example
 * ```typescript
 * import { whatsappTemplates } from '@/lib/whatsapp-templates';
 * 
 * const message = whatsappTemplates.followUp("João Silva");
 * console.log(message);
 * // Olá, João Silva! 👋
 * // 
 * // Espero que esteja bem!
 * // ...
 * ```
 */
export const whatsappTemplates: WhatsAppTemplates = {
  /**
   * Template para follow-up (acompanhamento)
   * 
   * Usado para fazer contato de acompanhamento após uma conversa,
   * reunião ou interação anterior com o cliente.
   * 
   * @param name - Nome do destinatário
   * @param context - Contexto opcional do follow-up (ex: "nossa reunião de ontem")
   * @returns Mensagem formatada de follow-up
   * 
   * @example
   * ```typescript
   * whatsappTemplates.followUp("Maria Santos", "nossa conversa sobre o projeto");
   * ```
   */
  followUp: (name: string, context?: string): string => {
    const contextText = context 
      ? `\n\nPassando para dar continuidade ${context}.` 
      : "\n\nPassando aqui para fazer um follow-up sobre nossa conversa anterior.";

    return `Olá, ${name}! 👋

Espero que esteja bem!${contextText}

Como posso ajudar hoje? Há algo em que você precise de suporte ou esclarecimentos?

Estou à disposição! 😊

---
*Balako Digital CRM*`;
  },

  /**
   * Template para lembretes (reminders)
   * 
   * Usado para lembrar clientes sobre tarefas, compromissos ou prazos.
   * 
   * @param name - Nome do destinatário
   * @param task - Descrição da tarefa ou compromisso
   * @param date - Data opcional (se não fornecida, assume "hoje")
   * @returns Mensagem formatada de lembrete
   * 
   * @example
   * ```typescript
   * whatsappTemplates.reminder("Carlos", "reunião de alinhamento", "amanhã às 14h");
   * ```
   */
  reminder: (name: string, task: string, date?: string): string => {
    const dateText = date || "hoje";

    return `Oi, ${name}! 📅

Este é um lembrete amigável sobre:

📋 *${task}*
🕐 ${dateText}

Por favor, confirme sua presença ou me avise caso precise reagendar.

Qualquer dúvida, estou aqui para ajudar! 😊

---
*Balako Digital CRM*`;
  },

  /**
   * Template de boas-vindas
   * 
   * Usado para receber novos clientes ou usuários no sistema.
   * 
   * @param name - Nome do destinatário
   * @param companyName - Nome da empresa (opcional)
   * @returns Mensagem formatada de boas-vindas
   * 
   * @example
   * ```typescript
   * whatsappTemplates.welcome("Ana Paula", "Balako Digital");
   * ```
   */
  welcome: (name: string, companyName?: string): string => {
    const companyText = companyName 
      ? `à ${companyName}` 
      : "ao nosso sistema";

    return `Olá, ${name}! 🎉

Seja muito bem-vindo(a) ${companyText}!

Estamos muito felizes em tê-lo(a) conosco! 

Se precisar de qualquer ajuda, orientação ou tiver alguma dúvida, não hesite em entrar em contato. Estou à disposição para garantir que sua experiência seja excelente! 😊

Vamos construir algo incrível juntos! 🚀

---
*Balako Digital CRM*`;
  },

  /**
   * Template personalizado
   * 
   * Permite criar mensagens customizadas mantendo o padrão de formatação.
   * 
   * @param name - Nome do destinatário
   * @param customText - Texto personalizado da mensagem
   * @returns Mensagem formatada personalizada
   * 
   * @example
   * ```typescript
   * whatsappTemplates.custom(
   *   "Roberto",
   *   "Seu relatório mensal está pronto para análise.\n\nPode conferir no sistema."
   * );
   * ```
   */
  custom: (name: string, customText: string): string => {
    return `Olá, ${name}! 👋

${customText}

Qualquer dúvida, estou à disposição! 😊

---
*Balako Digital CRM*`;
  },

  /**
   * Template para notificação de task
   * 
   * Usado quando uma task é criada ou atribuída ao cliente.
   * 
   * @param name - Nome do destinatário
   * @param taskTitle - Título da task
   * @param dueDate - Data de vencimento formatada
   * @returns Mensagem formatada de notificação de task
   * 
   * @example
   * ```typescript
   * whatsappTemplates.taskNotification("Pedro", "Revisar proposta", "15/11/2025");
   * ```
   */
  taskNotification: (name: string, taskTitle: string, dueDate: string): string => {
    return `Oi, ${name}! 📋

Você tem uma nova tarefa:

✅ *${taskTitle}*
📅 Prazo: ${dueDate}

Essa tarefa foi adicionada ao seu painel no CRM. 

Se precisar de mais informações ou tiver alguma dúvida, me avise! 😊

---
*Balako Digital CRM*`;
  },

  /**
   * Template para confirmação de reunião
   * 
   * Usado para confirmar agendamentos de reuniões.
   * 
   * @param name - Nome do destinatário
   * @param date - Data da reunião
   * @param time - Horário da reunião
   * @returns Mensagem formatada de confirmação
   * 
   * @example
   * ```typescript
   * whatsappTemplates.meetingConfirmation("Juliana", "15/11/2025", "10:00");
   * ```
   */
  meetingConfirmation: (name: string, date: string, time: string): string => {
    return `Olá, ${name}! 📆

Confirmando nossa reunião:

📍 Data: ${date}
🕐 Horário: ${time}

Por favor, confirme sua presença respondendo esta mensagem.

Caso precise remarcar, me avise com antecedência! 😊

Até lá! 👋

---
*Balako Digital CRM*`;
  },

  /**
   * Template de agradecimento
   * 
   * Usado para agradecer clientes após interações importantes.
   * 
   * @param name - Nome do destinatário
   * @param reason - Motivo do agradecimento (opcional)
   * @returns Mensagem formatada de agradecimento
   * 
   * @example
   * ```typescript
   * whatsappTemplates.thankYou("Fernanda", "sua confiança em nossos serviços");
   * ```
   */
  thankYou: (name: string, reason?: string): string => {
    const reasonText = reason 
      ? ` por ${reason}` 
      : " pela sua parceria";

    return `Olá, ${name}! 🙏

Gostaria de agradecer${reasonText}!

É um prazer trabalhar com você e contribuir para o sucesso do seu negócio.

Conte sempre conosco! 💙

---
*Balako Digital CRM*`;
  },

  /**
   * Template para atualização de status
   * 
   * Usado para informar mudanças de status em processos, projetos ou solicitações.
   * 
   * @param name - Nome do destinatário
   * @param status - Novo status
   * @param details - Detalhes adicionais (opcional)
   * @returns Mensagem formatada de atualização
   * 
   * @example
   * ```typescript
   * whatsappTemplates.statusUpdate("Lucas", "Em andamento", "Iniciamos a fase de desenvolvimento");
   * ```
   */
  statusUpdate: (name: string, status: string, details?: string): string => {
    const detailsText = details 
      ? `\n\n📝 *Detalhes:*\n${details}` 
      : "";

    return `Oi, ${name}! 🔔

Atualização de status:

📊 Status atual: *${status}*${detailsText}

Você pode acompanhar o progresso completo no nosso CRM.

Qualquer dúvida, estou aqui! 😊

---
*Balako Digital CRM*`;
  },
};

/**
 * Helper function para validar se um nome foi fornecido
 * 
 * @param name - Nome a ser validado
 * @throws Error se o nome estiver vazio
 */
export function validateName(name: string): void {
  if (!name || name.trim().length === 0) {
    throw new Error("Nome do destinatário é obrigatório para gerar template");
  }
}

/**
 * Helper function para formatar data no padrão brasileiro
 * 
 * @param date - Data a ser formatada (Date ou string ISO)
 * @returns Data formatada como DD/MM/YYYY
 * 
 * @example
 * ```typescript
 * formatBrazilianDate(new Date());
 * // "11/11/2025"
 * ```
 */
export function formatBrazilianDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const year = dateObj.getFullYear();
  
  return `${day}/${month}/${year}`;
}

/**
 * Helper function para formatar horário no padrão brasileiro
 * 
 * @param date - Data/hora a ser formatada
 * @returns Horário formatado como HH:MM
 * 
 * @example
 * ```typescript
 * formatBrazilianTime(new Date());
 * // "14:30"
 * ```
 */
export function formatBrazilianTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  const hours = dateObj.getHours().toString().padStart(2, "0");
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  
  return `${hours}:${minutes}`;
}

/**
 * Exportação default para uso simplificado
 */
export default whatsappTemplates;
