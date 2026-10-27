// What goes inside <body> on every page: the skip link, the header, the page, the footer. Both root layouts use it
// (the public site in app/[lang]/layout.js and the admin pages in app/(admin)/layout.js).
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function SiteShell({ lang, children }) {
  return (
    <>
      {/* First thing a keyboard user reaches: jumps past the header to the page's <main id="main-content"> */}
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <SiteHeader lang={lang} />
      {children}
      <SiteFooter />
    </>
  );
}
