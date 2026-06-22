import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // We sit inside a pnpm workspace with multiple lockfiles; pin the Turbopack
  // root to this app so Next stops inferring (and warning about) the parent.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
