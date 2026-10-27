// Shown when a page under /en or /es does not exist.
import Link from "next/link";

export const metadata = { title: "Page not found | OpenRaiz" };

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="page-main">
      <h1>Page not found</h1>
      <p className="page-intro">We couldn&rsquo;t find that page. The link may be incorrect.</p>
      <p>
        <Link className="button button-primary" href="/">
          Back to the home page
        </Link>
      </p>
    </main>
  );
}
