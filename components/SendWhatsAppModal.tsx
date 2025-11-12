"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircle, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

/**
 * Templates pré-definidos de mensagens
 */
const MESSAGE_TEMPLATES = {
  followup: `Olá! 👋

Passando aqui para fazer um follow-up sobre nossa conversa anterior.

Como posso ajudar hoje?`,
  
  reminder: `Oi! 📅

Este é um lembrete amigável sobre nosso compromisso.

Por favor, confirme sua presença.

Obrigado!`,
  
  welcome: `Olá! 🎉

Seja muito bem-vindo(a)!

Estamos muito felizes em tê-lo(a) conosco.

Se precisar de qualquer coisa, estou à disposição!`,
  
  custom: "",
} as const;

/**
 * Schema de validação usando Zod
 */
const whatsappFormSchema = z.object({
  phone: z
    .string()
    .min(10, "Telefone deve ter no mínimo 10 dígitos")
    .max(15, "Telefone deve ter no máximo 15 dígitos")
    .regex(/^[\d\s\(\)\-\+]+$/, "Telefone contém caracteres inválidos"),
  message: z
    .string()
    .min(1, "Mensagem não pode estar vazia")
    .max(4096, "Mensagem muito longa (máximo 4096 caracteres)"),
  template: z.enum(["followup", "reminder", "welcome", "custom"]).optional(),
});

type WhatsAppFormValues = z.infer<typeof whatsappFormSchema>;

/**
 * Props do componente SendWhatsAppModal
 */
interface SendWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactPhone: string;
  contactName: string;
  contactId?: string;
}

/**
 * Modal para envio de mensagens via WhatsApp
 * 
 * @component
 * @example
 * ```tsx
 * <SendWhatsAppModal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   contactPhone="(11) 99999-9999"
 *   contactName="João Silva"
 *   contactId="uuid-do-contato"
 * />
 * ```
 */
export function SendWhatsAppModal({
  isOpen,
  onClose,
  contactPhone,
  contactName,
  contactId,
}: SendWhatsAppModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Inicializar formulário com react-hook-form + zod
  const form = useForm<WhatsAppFormValues>({
    resolver: zodResolver(whatsappFormSchema),
    defaultValues: {
      phone: contactPhone,
      message: "",
      template: "custom",
    },
  });

  /**
   * Handler para mudança de template
   */
  const handleTemplateChange = (template: string) => {
    if (template in MESSAGE_TEMPLATES) {
      const templateKey = template as keyof typeof MESSAGE_TEMPLATES;
      form.setValue("message", MESSAGE_TEMPLATES[templateKey]);
      form.setValue("template", templateKey);
    }
  };

  /**
   * Handler para envio do formulário
   */
  const onSubmit = async (values: WhatsAppFormValues) => {
    try {
      setIsLoading(true);

      console.log("[SendWhatsAppModal] Sending message:", {
        phone: values.phone,
        messageLength: values.message.length,
        contactId,
      });

      // Chamar API de envio
      const response = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: values.phone,
          message: values.message,
          contactId: contactId || undefined,
        }),
      });

      const data = await response.json();

      // Tratar resposta
      if (response.ok && data.success) {
        console.log("[SendWhatsAppModal] Message sent successfully:", data);

        // Toast de sucesso
        toast({
          title: "✓ Mensagem enviada!",
          description: `WhatsApp enviado para ${contactName} com sucesso.`,
          variant: "default",
        });

        // Resetar formulário
        form.reset({
          phone: contactPhone,
          message: "",
          template: "custom",
        });

        // Fechar modal
        onClose();
      } else {
        // Erro no envio
        console.error("[SendWhatsAppModal] Failed to send:", data);

        toast({
          title: "✗ Erro ao enviar",
          description: data.error || data.message || "Não foi possível enviar a mensagem via WhatsApp.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("[SendWhatsAppModal] Error:", error);

      toast({
        title: "✗ Erro inesperado",
        description: "Ocorreu um erro ao enviar a mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handler para fechar modal
   */
  const handleClose = () => {
    if (!isLoading) {
      form.reset({
        phone: contactPhone,
        message: "",
        template: "custom",
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-600" />
            Enviar WhatsApp
          </DialogTitle>
          <DialogDescription>
            Enviar mensagem via WhatsApp para <strong>{contactName}</strong>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Campo: Telefone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(11) 99999-9999"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo: Template */}
            <FormField
              control={form.control}
              name="template"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template (opcional)</FormLabel>
                  <Select
                    onValueChange={handleTemplateChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um template" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="custom">
                        ✏️ Mensagem personalizada
                      </SelectItem>
                      <SelectItem value="followup">
                        📞 Follow-up
                      </SelectItem>
                      <SelectItem value="reminder">
                        📅 Lembrete
                      </SelectItem>
                      <SelectItem value="welcome">
                        🎉 Boas-vindas
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo: Mensagem */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite sua mensagem aqui..."
                      className="min-h-[150px] resize-y"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <FormMessage />
                    <span>
                      {field.value.length} / 4096 caracteres
                    </span>
                  </div>
                </FormItem>
              )}
            />

            {/* Footer com botões */}
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-4 w-4" />
                    Enviar WhatsApp
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
