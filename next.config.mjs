/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // One 404 page for the whole app (app/global-not-found.js): the app has two root layouts and a language segment at the top,
  // which the normal not-found.js cannot handle. Experimental in this version of Next.js.
  experimental: { globalNotFound: true },

  // Protective headers on every page and API answer. (HTTPS-only is already added by Vercel.) The policy below deliberately limits
  // only what can be done to our pages: nobody may show them inside another site's frame, and forms may only send to this site.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
        ],
      },
    ];
  },
};

export default nextConfig;
