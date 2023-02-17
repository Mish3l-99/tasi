import Head from "next/head";
import React, { useEffect } from "react";
import Room from "../components/Room";
import RoomLayout from "../components/sub/RoomLayout";
import { useAuth } from "../context/AuthContext";

import { isIOS, isSafari, isChrome } from "react-device-detect";
import RoomIPhone from "../components/sub/RoomIPhone";
import MobileRoom from "../components/sub/MobileRoom";

// console.log();

const RoomPage = () => {
  const { user } = useAuth();

  const localUser = {
    user: localStorage.getItem("our_user_user"),
    from: localStorage.getItem("our_user_from"),
    image: localStorage.getItem("our_user_image"),
  };

  let our_user;

  if (user === null) {
    our_user = localUser;
  } else {
    our_user = { user: user.uid, from: user.username, image: user.image };
  }

  console.log(our_user);

  // useEffect(() => {
  //   // window.addEventListener("resize", () => {
  //   //   console.log(window.innerHeight, window.innerWidth);
  //   // });
  //   console.log(window.innerHeight);
  // }, []);

  return (
    <>
      <Head>
        <title>TASI Talk Room</title>
        <meta
          name="viewport"
          content={`width=device-width,height=${window.innerHeight}, initial-scale=1.0,user-scalable=no`}
        ></meta>
        <link rel="icon" href="/logo/talk-favi.png" />
      </Head>
      <main className=" ">
        {window.innerWidth > 500 ? (
          <RoomLayout>
            <Room our_user={our_user} />
          </RoomLayout>
        ) : (
          <MobileRoom our_user={our_user} />
        )}
      </main>
    </>
  );
};

export default RoomPage;
