import { Html, Head, Main, NextScript } from "next/document";

const client = `${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`;

export default function Document() {
  return (
    <Html>
      <Head>
        {/* google search engine */}
        <meta
          name="google-site-verification"
          content="ZuAIZGdSfbT0W_NzkLkIGcyk4XWIngE-7TRxXj0cSpw"
        />

        {/* Google Adsense */}
        <scrip
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
