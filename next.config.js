/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  output: "standalone",
  images: {
    remotePatterns: [
      // {
      //   protocol: "https",
      //   hostname: "uploadthing.s3.amazonaws.com",
      //   pathname: "**",
      // },
      // {
      //   protocol: "https",
      //   hostname: "uploadthing.com",
      //   pathname: "**",
      // },
      // {
      //   protocol: "https",
      //   hostname: "utfs.io",
      //   pathname: "**",
      // },
      // {
      //   protocol: "https",
      //   hostname: "utfs.sh",
      //   pathname: "**",
      // },
      // {
      //   protocol: "https",
      //   hostname: "cdn.discordapp.com",
      //   pathname: "**",
      // },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default config;
