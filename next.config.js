/** @type {import('next').NextConfig} */
let nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  // ブラウザバックしたときに以前のスクロール位置を保持する
  // スクロールにwindow.scrollを使用しているっぽいので、例えば#__nextに
  // height:100dvh, overflow:autoとかを設定しても動かない。
  experimental: { scrollRestoration: true, instrumentationHook: true },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      // 外部ストレージを変えたときに変更し忘れそう
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/aluep-user-upload/**",
      },
    ],
  },
};

if (process.env.ANALYZE === "true") {
  const withNextBundleAnalyzer = require("next-bundle-analyzer")();
  nextConfig = withNextBundleAnalyzer(nextConfig);
}

module.exports = nextConfig;
