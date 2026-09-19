import { withContentCollections } from "@content-collections/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // configure-pages returns an empty path for the ukeSJTU.github.io user site.
  basePath: process.env.PAGES_BASE_PATH,
  // The default Next.js image optimizer requires a server at request time.
  images: {
    unoptimized: true,
  },
};

// withContentCollections must be the outermost plugin
export default withContentCollections(nextConfig);
