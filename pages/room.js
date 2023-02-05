import Head from "next/head";
import React, { useEffect } from "react";
import Room from "../components/Room";
import RoomLayout from "../components/sub/RoomLayout";
import { useAuth } from "../context/AuthContext";

const RoomPage = () => {
  const { userData, user, tempUser } = useAuth();

  let our_user;

  if (userData === null && tempUser === null) {
    our_user = {
      user: localStorage.getItem("our_user_user"),
      from: localStorage.getItem("our_user_from"),
      image: localStorage.getItem("our_user_image"),
    };
  } else {
    our_user =
      userData !== null
        ? { user: user.uid, from: userData.username, image: userData.image }
        : tempUser;
  }

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
          <Room our_user={our_user} />
        )}
      </main>
    </>
  );
};

export default RoomPage;

// export async function getServerSideProps(context) {
//   // const { userData, user, tempUser } = useAuth();
//   console.log(context);

//   // let our_user = userData
//   //   ? { user: user.uid, from: userData.username }
//   //   : tempUser;

//   // if (our_user === null) {
//   //   our_user = {
//   //     user: localStorage.getItem("our_user_user"),
//   //     from: localStorage.getItem("our_user_from"),
//   //   };
//   // }

//   return {
//     props: {}, // will be passed to the page component as props
//   };
// }
