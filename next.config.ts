import type { NextConfig } from "next";

function apiImagePattern() {
  const base =
    process.env.NEXT_PUBLIC_API_BASE ??
    (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api").replace(/\/api\/?$/, "");

  try {
    const url = new URL(base);
    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      ...(url.port ? { port: url.port } : {}),
      pathname: "/uploads/**",
    };
  } catch {
    return {
      protocol: "http" as const,
      hostname: "localhost",
      port: "3333",
      pathname: "/uploads/**",
    };
  }
}

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/favicon.ico",
        destination: "/img/favicon.png",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "midiaservice.onlyflow.com.br",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "midiaservice.onlyflow.com.br",
        pathname: "/**",
      },
      apiImagePattern(),
    ],
  },
};

export default nextConfig;
