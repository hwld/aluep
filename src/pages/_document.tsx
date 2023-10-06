import { ColorSchemeScript } from "@mantine/core";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        <link rel="icon" href="/logo.svg" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500;700;900&display=swap"
          rel="stylesheet"
        />
        <ColorSchemeScript defaultColorScheme="light" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
