import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Image optimisation ──────────────────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ── Compiler options ────────────────────────────────────────────────────
  compiler: {
    // Remove console.log in production (keep warn/error)
    removeConsole: { exclude: ["warn", "error"] },
  },

  // ── Experimental ────────────────────────────────────────────────────────
  experimental: {
    // Optimise package imports so only the icons/components actually used
    // are included in the bundle — avoids pulling in all 1000+ lucide icons
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-avatar",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toast",
      "@radix-ui/react-tooltip",
      "date-fns",
    ],
  },

  // ── Turbopack (dev only) ────────────────────────────────────────────────
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  // ── HTTP headers ────────────────────────────────────────────────────────
  async headers() {
    return [
      {
        // Cache static assets aggressively (hashed filenames, safe forever)
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache public images for 7 days
        source: "/(.+\\.(?:png|jpg|jpeg|gif|svg|ico|webp|avif))",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
