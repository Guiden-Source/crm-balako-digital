import { Resend } from "resend";

/**
 * Inicializar cliente Resend com API key do ambiente
 */
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Interface para resposta de envio de email
 */
interface SendEmailResponse {
  success: boolean;
  data?: any;
  error?: any;
}

/**
 * Valida os parâmetros de email
 * @throws Error se algum parâmetro for inválido
 */
function validateEmailParams(
  to: string,
  subject: string,
  text: string
): void {
  if (!to || typeof to !== "string" || to.trim().length === 0) {
    throw new Error("Parâmetro 'to' é obrigatório e não pode estar vazio");
  }

  if (!subject || typeof subject !== "string" || subject.trim().length === 0) {
    throw new Error(
      "Parâmetro 'subject' é obrigatório e não pode estar vazio"
    );
  }

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    throw new Error("Parâmetro 'text' é obrigatório e não pode estar vazio");
  }

  // Validação básica de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to)) {
    throw new Error(`Email inválido: ${to}`);
  }
}

/**
 * Converte texto simples para HTML
 * Substitui quebras de linha (\n) por tags <br>
 * Escapa caracteres HTML especiais para segurança
 * 
 * @param text - Texto simples a ser convertido
 * @returns HTML formatado
 */
function textToHtml(text: string): string {
  // Escapar caracteres HTML especiais
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  // Converter quebras de linha para <br>
  const withBreaks = escaped.replace(/\n/g, "<br>");

  // Retornar HTML básico com formatação
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .email-container {
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 30px;
    }
    .email-header {
      border-bottom: 3px solid #21808D;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    .email-content {
      margin: 20px 0;
    }
    .email-footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      font-size: 12px;
      color: #666;
      text-align: center;
    }
    .logo {
      color: #21808D;
      font-weight: bold;
      font-size: 18px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <div class="logo">Balako Digital CRM</div>
    </div>
    <div class="email-content">
      ${withBreaks}
    </div>
    <div class="email-footer">
      <p>Esta é uma mensagem automática do <strong>Balako Digital CRM</strong></p>
      <p>Por favor, não responda este email.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Envia email usando Resend API
 * 
 * Utiliza o serviço Resend para envio transacional de emails.
 * Requer RESEND_API_KEY configurada no arquivo .env.local
 * 
 * @param to - Endereço de email do destinatário
 * @param subject - Assunto do email
 * @param text - Conteúdo do email em texto simples
 * @returns Promise com objeto contendo success (boolean) e error opcional
 * 
 * @example
 * ```typescript
 * const result = await sendEmail(
 *   "usuario@example.com",
 *   "Bem-vindo ao CRM",
 *   "Olá!\n\nSeja bem-vindo ao nosso sistema.\n\nAtenciosamente,\nEquipe Balako"
 * );
 * 
 * if (result.success) {
 *   console.log("Email enviado com sucesso!", result.data);
 * } else {
 *   console.error("Erro ao enviar email:", result.error);
 * }
 * ```
 * 
 * @throws Não lança exceções - retorna objeto com success: false em caso de erro
 */
export async function sendEmail(
  to: string,
  subject: string,
  text: string
): Promise<SendEmailResponse> {
  try {
    // Validar RESEND_API_KEY
    if (!process.env.RESEND_API_KEY) {
      console.error("[EMAIL] RESEND_API_KEY not configured in environment");
      return {
        success: false,
        error: "RESEND_API_KEY não configurada no servidor",
      };
    }

    // Validar parâmetros
    try {
      validateEmailParams(to, subject, text);
    } catch (validationError) {
      console.error("[EMAIL] Validation error:", validationError);
      return {
        success: false,
        error:
          validationError instanceof Error
            ? validationError.message
            : "Erro de validação",
      };
    }

    console.log(`[EMAIL] Sending email to: ${to}`);
    console.log(`[EMAIL] Subject: ${subject}`);

    // Converter texto para HTML
    const html = textToHtml(text);

    // Enviar email via Resend
    const data = await resend.emails.send({
      from: "CRM Balako Digital <crm@balakodigital.com>",
      to: to.trim(),
      subject: subject.trim(),
      text: text.trim(),
      html,
    });

    console.log("[EMAIL] ✓ Email sent successfully");
    console.log("[EMAIL] Response data:", data);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("[EMAIL] ✗ Error sending email:", error);

    // Tratar erros específicos do Resend
    if (error && typeof error === "object" && "message" in error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao enviar email",
    };
  }
}

/**
 * Envia email com HTML customizado
 * 
 * Versão avançada que permite passar HTML customizado diretamente
 * ao invés de converter de texto simples
 * 
 * @param to - Endereço de email do destinatário
 * @param subject - Assunto do email
 * @param text - Conteúdo em texto simples (fallback)
 * @param html - Conteúdo HTML customizado
 * @returns Promise com objeto contendo success (boolean) e error opcional
 * 
 * @example
 * ```typescript
 * const result = await sendEmailWithHtml(
 *   "usuario@example.com",
 *   "Relatório Mensal",
 *   "Texto simples do relatório",
 *   "<h1>Relatório</h1><p>Conteúdo do relatório...</p>"
 * );
 * ```
 */
export async function sendEmailWithHtml(
  to: string,
  subject: string,
  text: string,
  html: string
): Promise<SendEmailResponse> {
  try {
    // Validar RESEND_API_KEY
    if (!process.env.RESEND_API_KEY) {
      console.error("[EMAIL] RESEND_API_KEY not configured in environment");
      return {
        success: false,
        error: "RESEND_API_KEY não configurada no servidor",
      };
    }

    // Validar parâmetros
    try {
      validateEmailParams(to, subject, text);
    } catch (validationError) {
      console.error("[EMAIL] Validation error:", validationError);
      return {
        success: false,
        error:
          validationError instanceof Error
            ? validationError.message
            : "Erro de validação",
      };
    }

    if (!html || typeof html !== "string" || html.trim().length === 0) {
      console.error("[EMAIL] HTML content is empty");
      return {
        success: false,
        error: "Parâmetro 'html' é obrigatório e não pode estar vazio",
      };
    }

    console.log(`[EMAIL] Sending HTML email to: ${to}`);
    console.log(`[EMAIL] Subject: ${subject}`);

    // Enviar email via Resend
    const data = await resend.emails.send({
      from: "CRM Balako Digital <crm@balakodigital.com>",
      to: to.trim(),
      subject: subject.trim(),
      text: text.trim(),
      html: html.trim(),
    });

    console.log("[EMAIL] ✓ HTML email sent successfully");
    console.log("[EMAIL] Response data:", data);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("[EMAIL] ✗ Error sending HTML email:", error);

    if (error && typeof error === "object" && "message" in error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao enviar email",
    };
  }
}

/**
 * Valida se um endereço de email é válido
 * 
 * @param email - Endereço de email a ser validado
 * @returns true se o email for válido, false caso contrário
 * 
 * @example
 * ```typescript
 * if (isValidEmail("usuario@example.com")) {
 *   // Email válido
 * }
 * ```
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}
