// The 404 page for any address that matches no page. It bypasses the layouts (the app has two, plus a language segment
// at the top), so it is a complete page of its own, written in both languages, with a link to each home page.
import "./globals.css";
import Link from "next/link";
import { en } from "@/lib/i18n/dictionaries/en.js";
import { es } from "@/lib/i18n/dictionaries/es.js";

export const metadata = { title: `${en.notFound.heading} | ${es.notFound.heading} | OpenRaiz` };

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <main id="main-content" className="page-main">
          <h1>{en.notFound.heading}</h1>
          <p className="page-intro">{en.notFound.intro}</p>
          <p>
            <Link className="button button-primary" href="/en">
              {en.notFound.back}
            </Link>
          </p>
          <h2 lang="es">{es.notFound.heading}</h2>
          <p className="page-intro" lang="es">
            {es.notFound.intro}
          </p>
          <p>
            <Link className="button button-secondary" href="/es" lang="es">
              {es.notFound.back}
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}
