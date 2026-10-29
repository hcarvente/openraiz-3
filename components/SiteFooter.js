// The footer shown on every page (placed once, in components/SiteShell.js).
import Link from "next/link";
import { localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default function SiteFooter({ lang = "en" }) {
  const t = getDictionary(lang);
  return (
    <footer className="site-footer">
      <p>{t.common.footer}</p>
      <p>
        <Link href={localePath(lang, "/accessibility")}>{t.accessibility.link}</Link>
      </p>
    </footer>
  );
}
