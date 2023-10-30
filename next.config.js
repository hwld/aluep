/** @type {import('next').NextConfig} */
let nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  // ブラウザバックしたときに以前のスクロール位置を保持する
  // スクロールにwindow.scrollを使用しているっぽいので、例えば#__nextに
  // height:100dvh, overflow:autoとかを設定しても動かない。
  experimental: { scrollRestoration: true },
};

if (process.env.ANALYZE === "true") {
  const withNextBundleAnalyzer = require("next-bundle-analyzer")();
  nextConfig = withNextBundleAnalyzer(nextConfig);
}

module.exports = nextConfig;
