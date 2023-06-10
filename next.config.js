/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  // ブラウザバックしたときに以前のスクロール位置を保持する
  // スクロールにwindow.scrollを使用しているっぽいので、例えば#__nextに
  // height:100dvh, overflow:autoとかを設定しても動かない。
  experimental: { scrollRestoration: true },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
