/** @type {import("next").NextConfig} */
const nextConfig = {
  // Avoid the additional Babel compilation during local development.
  reactCompiler: process.env.NODE_ENV === "production",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: `/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/**`,
      },
    ],
  },
};

export default nextConfig;
