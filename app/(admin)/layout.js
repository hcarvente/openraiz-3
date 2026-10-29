// The root layout for the admin pages (/admin/...). They are English only and are not part of the /en and /es site,
// so they have their own <html> with lang="en".
import "../globals.css";
import { Fraunces } from "next/font/google";
import SiteShell from "@/components/SiteShell";
import { siteMetadata } from "@/lib/siteMetadata";

export const metadata = siteMetadata;

// The same heading typeface as the public site (see app/[lang]/layout.js).
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });

export default function AdminRootLayout({ children }) {
  return (
    <html lang="en" className={fraunces.variable}>
      <body>
        <SiteShell lang="en" showLanguageToggle={false}>{children}</SiteShell>
      </body>
    </html>
  );
}
