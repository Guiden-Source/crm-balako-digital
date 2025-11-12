import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["pt"],
  defaultLocale: "pt",
  localePrefix: "never", // Remove o prefixo /pt das URLs
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
