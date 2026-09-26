/** @type {import('next').NextConfig} */
const nextConfig = {
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
  serverExternalPackages: ["mongodb"],
};

export default nextConfig;
