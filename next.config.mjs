// Security headers sent with every response.
const securityHeaders = [
  // Stop browsers guessing content types
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Never allow the site to be embedded in a frame (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  // Send only the origin, not the full URL, to other sites
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site uses none of these device features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  // Browsers must use HTTPS for the next two years
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000",
  },
  // Deliberately limited to directives that cannot block the site's own
  // scripts or styles: no framing, no <base> hijack, forms post only to
  // this site, no plugins. A script-src policy would need nonces.
  {
    key: "Content-Security-Policy",
    value:
      "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Do not advertise the framework in an X-Powered-By header
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      // The contact card used to be a file in public/documents. It is now
      // generated from the public profile; this keeps the old address alive.
      {
        source: "/documents/Rasel_Rana.vcf",
        destination: "/contact-card.vcf",
        permanent: false,
      },
      // Same for the portfolio, now generated from the Portfolio dashboard.
      {
        source: "/documents/Rasel_Rana_Portfolio.pdf",
        destination: "/portfolio.pdf",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/blog",
        destination: `${process.env.BLOG_DOMAIN}/blog`,
      },
      {
        source: "/blog/:path+",
        destination: `${process.env.BLOG_DOMAIN}/blog/:path+`,
      },
    ];
  },
  serverExternalPackages: ["mongodb", "@react-pdf/renderer"],
};

export default nextConfig;
