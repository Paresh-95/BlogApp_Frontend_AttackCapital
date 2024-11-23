import { hostname } from "os";
import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
      },

      {
        protocol: "https",
        hostname: "media.licdn.com",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "s3-ap-south-1.amazonaws.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname:"i.vimeocdn.com",
        pathname: "**",
      },
    ],
  },
  
};

export default nextConfig;
