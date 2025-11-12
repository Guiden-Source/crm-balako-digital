import "./globals.css";

import { Metadata } from "next";
import { Inter } from "next/font/google";

import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { createTranslator, NextIntlClientProvider } from "next-intl";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/app/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

async function getLocales(locale: string) {
  try {
    return (await import(`@/locales/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export async function generateMetadata(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const messages = await getLocales(locale);

  const t = createTranslator({ locale, messages });

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
    title: t("RootLayout.title"),
    description: t("RootLayout.description"),
    openGraph: {
      images: [
        {
          url: "/images/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: t("RootLayout.title"),
        },
      ],
    },
    twitter: {
      cardType: "summary_large_image",
      image: "/images/opengraph-image.png",
      width: 1200,
      height: 630,
      alt: t("RootLayout.title"),
    },
  };
}

export default async function RootLayout(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const {
    children
  } = props;

  const messages = await getLocales(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1"
        />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Balako Digital CRM" />
        <meta
          property="og:description"
          content="CRM para agências de marketing digital com automação via WhatsApp. Gerencie múltiplos clientes, envie mensagens automatizadas e acompanhe todas as interações em um só lugar."
        />
        <meta property="og:image" content="/images/balako-logo-svg4.svg" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="balakodigital.com" />
        <meta property="twitter:url" content={process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"} />
        <meta name="twitter:title" content="Balako Digital CRM" />
        <meta
          name="twitter:description"
          content="CRM para agências de marketing digital com automação via WhatsApp. Gerencie múltiplos clientes, envie mensagens automatizadas e acompanhe todas as interações em um só lugar."
        />
        <meta name="twitter:image" content="/images/balako-logo-svg4.svg" />
      </head>
      <body className={inter.className + " min-h-screen"}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
        <Toaster />
        <SonnerToaster />
      </body>
    </html>
  );
}
