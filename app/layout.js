import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "OpenRaiz",
  description:
    "OpenRaiz connects young people with jobs, internships, fellowships, and volunteer opportunities.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicon-180.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* First thing a keyboard user reaches: jumps past the header to the page's <main id="main-content"> */}
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
