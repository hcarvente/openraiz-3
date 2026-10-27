// What goes inside <body> on every page: the skip link, the header, the page, the footer. Both root layouts use it
// (the public site in app/[lang]/layout.js and the admin pages in app/(admin)/layout.js, which have no language switch).
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default function SiteShell({ lang, showLanguageToggle = true, children }) {
  const t = getDictionary(lang);
  return (
    <>
      {/* First thing a keyboard user reaches: jumps past the header to the page's <main id="main-content"> */}
      <a className="skip-link" href="#main-content">
        {t.common.skipLink}
      </a>
      <SiteHeader lang={lang} showLanguageToggle={showLanguageToggle} />
      {children}
      <SiteFooter lang={lang} />
    </>
  );
}
