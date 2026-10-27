// The root layout for the public site. The language comes from the address (/en/..., /es/...), so <html lang> is
// right on every page and the pages can still be built ahead of time (generateStaticParams lists both languages).
import "../globals.css";
import { notFound } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import { LOCALES, isLocale } from "@/lib/i18n/config";
import { siteMetadata } from "@/lib/siteMetadata";

export const metadata = siteMetadata;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={lang}>
      <body>
        <SiteShell lang={lang}>{children}</SiteShell>
      </body>
    </html>
  );
}
