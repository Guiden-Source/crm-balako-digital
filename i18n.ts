import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

export default getRequestConfig(async () => {
  // Await headers to fix Next.js 15 sync dynamic APIs warning
  await headers();
  
  return {
    locale: "pt",
    messages: (await import(`./locales/pt.json`)).default,
    timeZone: "America/Sao_Paulo",
  };
});
