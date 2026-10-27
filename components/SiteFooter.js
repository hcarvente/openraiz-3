// The footer shown on every page (placed once, in components/SiteShell.js).
import { getDictionary } from "@/lib/i18n/dictionaries";

export default function SiteFooter({ lang = "en" }) {
  const t = getDictionary(lang);
  return (
    <footer className="site-footer">
      <p>{t.common.footer}</p>
    </footer>
  );
}
