import axios, { AxiosError } from "axios";

/**
 * Configuração da Evolution API
 * Variáveis de ambiente necessárias no .env.local:
 * - EVOLUTION_API_URL
 * - EVOLUTION_API_KEY
 * - EVOLUTION_INSTANCE_NAME
 */
const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL;
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY;
const EVOLUTION_INSTANCE_NAME = process.env.EVOLUTION_INSTANCE_NAME;

/**
 * Interface para resposta de envio de mensagem
 */
interface SendMessageResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Interface para status da instância
 */
interface InstanceStatus {
  connected: boolean;
  state?: string;
  error?: string;
}

/**
 * Valida se as variáveis de ambiente estão configuradas
 * @throws Error se alguma variável estiver faltando
 */
function validateEnvironmentVariables(): void {
  if (!EVOLUTION_API_URL) {
    throw new Error(
      "EVOLUTION_API_URL não configurada. Adicione no arquivo .env.local"
    );
  }
  if (!EVOLUTION_API_KEY) {
    throw new Error(
      "EVOLUTION_API_KEY não configurada. Adicione no arquivo .env.local"
    );
  }
  if (!EVOLUTION_INSTANCE_NAME) {
    throw new Error(
      "EVOLUTION_INSTANCE_NAME não configurada. Adicione no arquivo .env.local"
    );
  }
}

/**
 * Formata número de telefone para o padrão do WhatsApp
 * 
 * Remove caracteres especiais, adiciona código do Brasil (55) se necessário
 * e adiciona o sufixo @s.whatsapp.net
 * 
 * @param phone - Número de telefone em qualquer formato
 * @returns Número formatado no padrão WhatsApp (ex: 5511999999999@s.whatsapp.net)
 * 
 * @example
 * ```typescript
 * formatPhoneNumber("(11) 99999-9999")
 * // Retorna: "5511999999999@s.whatsapp.net"
 * 
 * formatPhoneNumber("11 9 9999-9999")
 * // Retorna: "5511999999999@s.whatsapp.net"
 * 
 * formatPhoneNumber("5511999999999")
 * // Retorna: "5511999999999@s.whatsapp.net"
 * 
 * formatPhoneNumber("+55 11 99999-9999")
 * // Retorna: "5511999999999@s.whatsapp.net"
 * ```
 */
export function formatPhoneNumber(phone: string): string {
  try {
    // Remove todos os caracteres não numéricos
    let cleanPhone = phone.replace(/\D/g, "");

    // Remove o "+" do início se existir (já foi removido acima, mas por garantia)
    if (cleanPhone.startsWith("+")) {
      cleanPhone = cleanPhone.substring(1);
    }

    // Adiciona código do Brasil (55) se não tiver
    if (!cleanPhone.startsWith("55")) {
      cleanPhone = "55" + cleanPhone;
    }

    // Remove o 9º dígito extra se houver (alguns números têm 55 + DDD + 9 + número)
    // Padrão correto: 55 + DDD (2 dígitos) + número (9 dígitos)
    // Total: 13 dígitos
    if (cleanPhone.length > 13) {
      // Remove dígitos extras
      cleanPhone = cleanPhone.substring(0, 13);
    }

    // Adiciona o sufixo do WhatsApp
    const formattedPhone = `${cleanPhone}@s.whatsapp.net`;

    console.log(`[WHATSAPP] Phone formatted: ${phone} → ${formattedPhone}`);
    return formattedPhone;
  } catch (error) {
    console.error("[WHATSAPP] Error formatting phone:", error);
    throw new Error(`Erro ao formatar número de telefone: ${phone}`);
  }
}

/**
 * Envia mensagem de texto via WhatsApp usando Evolution API
 * 
 * @param phone - Número de telefone (será formatado automaticamente)
 * @param message - Texto da mensagem a ser enviada
 * @returns Objeto com status de sucesso e dados da resposta ou erro
 * 
 * @example
 * ```typescript
 * const result = await sendWhatsAppMessage(
 *   "(11) 99999-9999",
 *   "Olá! Esta é uma mensagem de teste."
 * );
 * 
 * if (result.success) {
 *   console.log("Mensagem enviada:", result.data);
 * } else {
 *   console.error("Erro ao enviar:", result.error);
 * }
 * ```
 */
export async function sendWhatsAppMessage(
  phone: string,
  message: string
): Promise<SendMessageResponse> {
  try {
    // Validar variáveis de ambiente
    validateEnvironmentVariables();

    // Formatar número de telefone
    const formattedPhone = formatPhoneNumber(phone);

    // Construir URL da API
    const url = `${EVOLUTION_API_URL}/message/sendText/${EVOLUTION_INSTANCE_NAME}`;

    console.log(`[WHATSAPP] Sending message to ${formattedPhone}`);
    console.log(`[WHATSAPP] URL: ${url}`);

    // Fazer requisição para Evolution API
    const response = await axios.post(
      url,
      {
        number: formattedPhone,
        text: message,
      },
      {
        headers: {
          "Content-Type": "application/json",
          apikey: EVOLUTION_API_KEY!,
        },
        timeout: 30000, // 30 segundos de timeout
      }
    );

    console.log("[WHATSAPP] Message sent successfully:", response.data);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("[WHATSAPP] Error sending message:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      return {
        success: false,
        error: axiosError.response?.data || axiosError.message,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido ao enviar mensagem",
    };
  }
}

/**
 * Verifica o status de conexão da instância do WhatsApp na Evolution API
 * 
 * @returns Objeto com status de conexão (connected: true/false)
 * 
 * @example
 * ```typescript
 * const status = await getInstanceStatus();
 * 
 * if (status.connected) {
 *   console.log("WhatsApp conectado! Estado:", status.state);
 * } else {
 *   console.error("WhatsApp desconectado:", status.error);
 * }
 * ```
 */
export async function getInstanceStatus(): Promise<InstanceStatus> {
  try {
    // Validar variáveis de ambiente
    validateEnvironmentVariables();

    // Construir URL da API
    const url = `${EVOLUTION_API_URL}/instance/connectionState/${EVOLUTION_INSTANCE_NAME}`;

    console.log(`[WHATSAPP] Checking instance status: ${url}`);

    // Fazer requisição para Evolution API
    const response = await axios.get(url, {
      headers: {
        apikey: EVOLUTION_API_KEY!,
      },
      timeout: 10000, // 10 segundos de timeout
    });

    console.log("[WHATSAPP] Instance status:", response.data);

    // A Evolution API retorna diferentes formatos dependendo da versão
    // Vamos lidar com os formatos mais comuns
    const state = response.data.state || response.data.instance?.state || "unknown";
    const connected = state === "open" || state === "connected";

    return {
      connected,
      state,
    };
  } catch (error) {
    console.error("[WHATSAPP] Error checking instance status:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      return {
        connected: false,
        error: axiosError.response?.data
          ? JSON.stringify(axiosError.response.data)
          : axiosError.message,
      };
    }

    return {
      connected: false,
      error: error instanceof Error ? error.message : "Erro desconhecido ao verificar status",
    };
  }
}

/**
 * Envia mensagem com imagem via WhatsApp usando Evolution API
 * 
 * @param phone - Número de telefone (será formatado automaticamente)
 * @param imageUrl - URL da imagem a ser enviada
 * @param caption - Legenda da imagem (opcional)
 * @returns Objeto com status de sucesso e dados da resposta ou erro
 * 
 * @example
 * ```typescript
 * const result = await sendWhatsAppImage(
 *   "(11) 99999-9999",
 *   "https://example.com/image.jpg",
 *   "Confira esta imagem!"
 * );
 * ```
 */
export async function sendWhatsAppImage(
  phone: string,
  imageUrl: string,
  caption?: string
): Promise<SendMessageResponse> {
  try {
    validateEnvironmentVariables();
    const formattedPhone = formatPhoneNumber(phone);
    const url = `${EVOLUTION_API_URL}/message/sendMedia/${EVOLUTION_INSTANCE_NAME}`;

    console.log(`[WHATSAPP] Sending image to ${formattedPhone}`);

    const response = await axios.post(
      url,
      {
        number: formattedPhone,
        mediatype: "image",
        media: imageUrl,
        caption: caption || "",
      },
      {
        headers: {
          "Content-Type": "application/json",
          apikey: EVOLUTION_API_KEY!,
        },
        timeout: 30000,
      }
    );

    console.log("[WHATSAPP] Image sent successfully:", response.data);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("[WHATSAPP] Error sending image:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      return {
        success: false,
        error: axiosError.response?.data || axiosError.message,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido ao enviar imagem",
    };
  }
}

/**
 * Envia mensagem com arquivo via WhatsApp usando Evolution API
 * 
 * @param phone - Número de telefone (será formatado automaticamente)
 * @param fileUrl - URL do arquivo a ser enviado
 * @param fileName - Nome do arquivo
 * @param caption - Legenda do arquivo (opcional)
 * @returns Objeto com status de sucesso e dados da resposta ou erro
 * 
 * @example
 * ```typescript
 * const result = await sendWhatsAppFile(
 *   "(11) 99999-9999",
 *   "https://example.com/document.pdf",
 *   "documento.pdf",
 *   "Segue o documento solicitado"
 * );
 * ```
 */
export async function sendWhatsAppFile(
  phone: string,
  fileUrl: string,
  fileName: string,
  caption?: string
): Promise<SendMessageResponse> {
  try {
    validateEnvironmentVariables();
    const formattedPhone = formatPhoneNumber(phone);
    const url = `${EVOLUTION_API_URL}/message/sendMedia/${EVOLUTION_INSTANCE_NAME}`;

    console.log(`[WHATSAPP] Sending file to ${formattedPhone}`);

    const response = await axios.post(
      url,
      {
        number: formattedPhone,
        mediatype: "document",
        media: fileUrl,
        fileName,
        caption: caption || "",
      },
      {
        headers: {
          "Content-Type": "application/json",
          apikey: EVOLUTION_API_KEY!,
        },
        timeout: 30000,
      }
    );

    console.log("[WHATSAPP] File sent successfully:", response.data);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("[WHATSAPP] Error sending file:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      return {
        success: false,
        error: axiosError.response?.data || axiosError.message,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido ao enviar arquivo",
    };
  }
}

/**
 * Valida se um número de telefone é válido para WhatsApp
 * 
 * @param phone - Número de telefone a ser validado
 * @returns true se o número for válido, false caso contrário
 * 
 * @example
 * ```typescript
 * if (isValidPhoneNumber("(11) 99999-9999")) {
 *   // Número válido, prosseguir com envio
 * }
 * ```
 */
export function isValidPhoneNumber(phone: string): boolean {
  try {
    const cleanPhone = phone.replace(/\D/g, "");
    
    // Número brasileiro deve ter:
    // - Código do país (55): 2 dígitos
    // - DDD: 2 dígitos
    // - Número: 8 ou 9 dígitos
    // Total: 12 ou 13 dígitos
    
    if (cleanPhone.startsWith("55")) {
      return cleanPhone.length === 12 || cleanPhone.length === 13;
    }
    
    // Se não começar com 55, deve ter 10 ou 11 dígitos (DDD + número)
    return cleanPhone.length === 10 || cleanPhone.length === 11;
  } catch (error) {
    return false;
  }
}
