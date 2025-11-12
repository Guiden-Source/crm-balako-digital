# Instruções de Instalação - Dependência Resend

## 📦 Instalar Resend

Execute o seguinte comando no terminal:

```bash
npm install resend
```

ou usando pnpm (recomendado para este projeto):

```bash
pnpm install resend
```

## ✅ Verificação

Após a instalação, verifique se a dependência foi adicionada ao `package.json`:

```json
{
  "dependencies": {
    "resend": "^3.0.0"
  }
}
```

## 🔧 Configuração

1. **Obter API Key do Resend:**
   - Acesse: https://resend.com
   - Crie uma conta ou faça login
   - Vá para "API Keys" no dashboard
   - Clique em "Create API Key"
   - Copie a chave gerada (formato: `re_xxxxxxxxxx`)

2. **Adicionar no .env.local:**
   ```bash
   RESEND_API_KEY="re_[SUA_CHAVE_AQUI]"
   ```

3. **Verificar domínio:**
   - No Resend dashboard, adicione e verifique seu domínio
   - Adicione os registros DNS necessários (SPF, DKIM, etc)
   - Aguarde a verificação (pode levar até 48h)

## 📧 Uso

```typescript
import { sendEmail } from "@/lib/email";

const result = await sendEmail(
  "usuario@example.com",
  "Assunto do email",
  "Corpo da mensagem\n\nCom quebras de linha"
);

if (result.success) {
  console.log("Email enviado!");
} else {
  console.error("Erro:", result.error);
}
```

## 🎯 Recursos Implementados

- ✅ `sendEmail()` - Envio básico com conversão texto → HTML
- ✅ `sendEmailWithHtml()` - Envio com HTML customizado
- ✅ `isValidEmail()` - Validação de formato de email
- ✅ Template HTML responsivo com cores Balako Digital
- ✅ Validação de parâmetros
- ✅ Error handling completo
- ✅ Logs detalhados com prefixo [EMAIL]

## 🚨 Limitações do Plano Free

- **100 emails/dia** (plano gratuito)
- **1 domínio verificado**
- Upgrade para planos pagos se precisar de mais volume

## 📚 Documentação

- Resend Docs: https://resend.com/docs
- API Reference: https://resend.com/docs/api-reference/emails/send-email
