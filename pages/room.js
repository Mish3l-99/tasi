import Head from "next/head";
import React from "react";
import Room from "../components/Room";

const RoomPage = () => {
  return (
    <>
      <Head>
        <title>TASI Talk Room</title>
        <meta
          name="description"
          content="This is the number one platform in talking about stocks and trading in Saudi"
        />
        <link rel="icon" href="/logo/talk-favi.png" />
      </Head>
      <main>
        <Room />
      </main>
    </>
  );
};

export default RoomPage;
