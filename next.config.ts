import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Google user profile photos (OAuth)
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        // Avatar placeholder service used in dashboard / profile
        protocol: "https",
        hostname: "avatar.iran.liara.run",
      },
    ],
  },
};

export default nextConfig;
