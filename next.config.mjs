/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**", // Optional: for YouTube thumbnails
      },
      {
        protocol: "https",
        hostname: "yt3.ggpht.com",
        pathname: "**", // Allows all paths under yt3.ggpht.com
      },
    ],
  },
};

export default nextConfig;
