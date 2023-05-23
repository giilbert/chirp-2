import { Html, Head, Main, NextScript } from "next/document";
import { roboto } from "./_app";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className={`dark ${roboto.className}`}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
