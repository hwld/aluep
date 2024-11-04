import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ja" data-mantine-color-schema="light">
      <Head>
        <link rel="icon" href="/app-logo.svg" />
        {/* ColorSchemaScriptをimportすると、Node.js側でMantineに関連するすべてのモジュールが解決されてしまうため、ハードコードする */}
        {/* https://github.com/mantinedev/mantine/blob/master/packages/%40mantine/core/src/core/MantineProvider/ColorSchemeScript/ColorSchemeScript.tsx */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            document.documentElement.setAttribute("data-mantine-color-scheme", 'light');
          `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
