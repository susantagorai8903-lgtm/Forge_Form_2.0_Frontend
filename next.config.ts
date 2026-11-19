import type { NextConfig } from "next";

function getZoneOrigin(variable: string): string | undefined {
  const configured = process.env[variable]?.trim();
  if (!configured) return undefined;

  let url: URL;
  try {
    url = new URL(configured);
  } catch {
    throw new Error(`${variable} must be an absolute HTTPS origin.`);
  }
  if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error(`${variable} must be an HTTPS origin without a path.`);
  }
  return url.origin;
}

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  transpilePackages: ["@forge-form/shared"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async rewrites() {
    const bookingOrigin = getZoneOrigin("BOOKING_ZONE_ORIGIN");
    const adminOrigin = getZoneOrigin("ADMIN_ZONE_ORIGIN");
    const beforeFiles = [];
    if (bookingOrigin) {
      beforeFiles.push({
        source: "/book-consultation/:path*",
        destination: `${bookingOrigin}/book-consultation/:path*`,
      });
    }
    if (adminOrigin) {
      beforeFiles.push(
        { source: "/admin", destination: `${adminOrigin}/admin` },
        { source: "/admin/:path*", destination: `${adminOrigin}/admin/:path*` },
        { source: "/api/admin-proxy/:path*", destination: `${adminOrigin}/api/admin-proxy/:path*` },
        { source: "/api/auth/:path*", destination: `${adminOrigin}/api/auth/:path*` },
      );
    }
    return beforeFiles.length ? { beforeFiles } : [];
  },
};

export default nextConfig;
