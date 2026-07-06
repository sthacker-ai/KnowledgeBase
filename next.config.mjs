// Dev and prod use SEPARATE build dirs so a production `npm run build` (e.g. the
// daily pipeline's prod deploy) can never corrupt a running `next dev` cache, and
// vice versa. `next dev` runs with NODE_ENV=development; `next build`/`next start`
// run with NODE_ENV=production — so this cleanly routes each to its own directory.
const isDev = process.env.NODE_ENV === "development";

const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  distDir: isDev ? ".next-dev" : ".next",
};

export default nextConfig;
