/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // One 404 page for the whole app (app/global-not-found.js): the app has two root layouts and a language segment at the top,
  // which the normal not-found.js cannot handle. Experimental in this version of Next.js.
  experimental: { globalNotFound: true },
};

export default nextConfig;
