// The root layout for the admin pages (/admin/...). They are English only and are not part of the /en and /es site,
// so they have their own <html> with lang="en".
import "../globals.css";
import SiteShell from "@/components/SiteShell";
import { siteMetadata } from "@/lib/siteMetadata";

export const metadata = siteMetadata;

export default function AdminRootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SiteShell lang="en">{children}</SiteShell>
      </body>
    </html>
  );
}
