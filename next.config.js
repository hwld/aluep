/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  // ブラウザバックしたときに以前のスクロール位置を保持する
  // TODO: 動かなくなってるし、一番下までスクロールしたあとに遷移すると、
  // 次のページでもスクロールが保持されてしまう？
  experimental: { scrollRestoration: true },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
