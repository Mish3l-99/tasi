import { clearAllBodyScrollLocks, disableBodyScroll } from "body-scroll-lock";
import {
  addDoc,
  collection,
  orderBy,
  limit,
  onSnapshot,
  query,
} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { isAndroid, isChrome, isIOS } from "react-device-detect";
import { toast } from "react-hot-toast";

import { AiOutlineSend } from "react-icons/ai";
import { BsPatchCheckFill } from "react-icons/bs";
import { IoEnterOutline } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import Loading from "../Loading";

function getTime(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp);

  var hour = a.getHours();
  var min = a.getMinutes();
  var time = hour + ":" + min;
  return time;
}

const MobileRoom = ({ our_user }) => {
  const [messages, setMessages] = useState();
  const [message, setMessage] = useState("");
  const [snapshotCount, setSnapshotCount] = useState(0);

  const [height, setHeight] = useState(0);

  const router = useRouter();

  const stopScrolling = () => {
    const targetDiv = document.getElementById("messages-container");
    disableBodyScroll(targetDiv);
  };

  useEffect(() => {
    stopScrolling();
    return () => {
      clearAllBodyScrollLocks();
    };
  }, []);

  // const { user } = useAuth();

  // const windowSize = useRef(window.innerWidth);

  // let our_user = userData
  //   ? { user: user.uid, from: userData.username }
  //   : tempUser;
  // if (our_user !== null) {
  //   localStorage.setItem("our_user_user", our_user.user);
  //   localStorage.setItem("our_user_from", our_user.from);
  // }
  // console.log({
  //   user: localStorage.getItem("our_user_user"),
  //   from: localStorage.getItem("our_user_from"),
  // });
  // const [ourUser, setOurUser] = useState(our_user);

  const filterMessage = (mssg) => {
    // filter for bad words here
    if (mssg.includes("bad_words")) {
      toast.error("use appropriate language !");
      return "";
    } else {
      return mssg;
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault(e);
    messageBoxRef.current.focus();
    const readyMessage = filterMessage(message);
    if (readyMessage !== "") {
      const createdAt = new Date().getTime();
      setMessage("");
      await addDoc(collection(db, "messages"), {
        ...our_user,
        text: readyMessage,
        createdAt,
      });
    }
  };

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "messages"),
          orderBy("createdAt", "desc"),
          limit(100)
        ),
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setMessages(data.reverse());
          setSnapshotCount((snapshotCount) => snapshotCount + 1);
        }
      ),
    []
  );

  const messagesEndRef = useRef(null);
  const messageBoxRef = useRef(null);

  const sendBox = useRef(null);

  useEffect(() => {
    // setHeight(screen.height - sendBox.current.clientHeight);
    // if (isAndroid && isChrome) {
    //   setHeight(screen.height - sendBox.current.clientHeight);
    // } else {
    // }

    // for the sendBox there is scrollHeight, clientHeight, offsetHeight
    // for the window, there is innerHeight, outerHeight and more clg the window obj
    // for the screen, clg the screen obj

    setHeight(window.innerHeight - sendBox.current.scrollHeight);
    // console.log(sendBox.current.scrollHeight);
    // console.log(sendBox);
    // setHeight(window.innerHeight - sendBox.current.clientHeight);
    // console.log(window.height);
  }, []);

  const scrollToBottom = () => {
    // const objDiv = document.getElementById("messages-container");
    // objDiv.scrollTop = objDiv.scrollHeight;
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  const scrollBottomSmooth = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (snapshotCount > 1) {
      setTimeout(() => {
        scrollBottomSmooth();
      }, 50);
    } else {
      // first time
      scrollToBottom();
    }
  }, [messages]);

  // useEffect(() => {
  //   return () => {
  //     ;
  //   };
  // }, []);

  // useEffect(() => {
  //   return (
  //     !ourUser &&
  //     setOurUser({
  //       user: localStorage.getItem("our_user_user"),
  //       from: localStorage.getItem("our_user_from"),
  //     })
  //   );
  // }, []);

  if (our_user.from === null) {
    router.replace("/");
    return;
  }

  // if (!messages) {
  //   return <Loading />;
  // }

  // console.log(our_user);

  return (
    <div dir="rtl" className="w-screen overflow-hidden relative md:bg-blue-200">
      {/* first */}
      {/* <div className="fixed h-[50px] md:h-fit md:sticky w-full top-0 z-[99] pb-1 flex items-center justify-between py-0 md:py-2 bg-blue-200">
        <div className="px-3 my-auto h-fit">
          <p className="font-semibold text-[16px] md:text-[20px]">
            ???????????? ???????????? - TASI
          </p>
        </div>
        <div className="flex items-center gap-x-2 px-3 my-auto h-fit">
          <div className="w-8 h-8 p-2 rounded-full bg-slate-700 text-white flex items-center justify-center relative">
            {our_user.from === null ? (
              ""
            ) : our_user.image === "" || our_user.image === null ? (
              our_user?.from[0]?.toUpperCase()
            ) : (
              <Image
                className="rounded-full"
                alt="/"
                src={our_user?.image}
                fill
              />
            )}
          </div>
          <div>
            <Link href="/">
              <div className="flex items-center gap-x-1 py-[1px] px-1 md:px-2 bg-gray-50 rounded">
                <span className="hidden md:block">????????????</span>
                <IoEnterOutline className="scale-x-[-1]" />
              </div>
            </Link>
          </div>
        </div>
      </div> */}
      {/* messages box */}
      <div
        style={{ height: height }}
        id="messages-container"
        className="w-full overflow-y-auto pt-[3px] scrollbar-hide"
      >
        <div className="px-2 bg-white pt-1 rounded">
          {!messages ? (
            <Loading />
          ) : (
            messages?.map((msg, i) => {
              let me = msg.user === our_user.user;
              let clas = me ? "bg-green-100" : "bg-blue-50";
              let BGclas = me ? "bg-green-600" : "bg-slate-700";

              let member = false;
              if (!msg.user.includes("/")) {
                member = true;
              }

              return (
                <div key={i} dir="" className="flex items-start gap-x-1 mb-1">
                  <div
                    className={`w-8 h-8 p-2 rounded-full ${BGclas} text-white flex items-center justify-center relative`}
                  >
                    {!msg.image ? (
                      msg?.from[0]?.toUpperCase()
                    ) : (
                      <Image
                        className="rounded-full"
                        alt="/"
                        src={msg.image}
                        fill
                      />
                    )}
                  </div>
                  <div>
                    <div
                      className={`px-2 py-[3px] border w-fit rounded flex flex-col ${clas} `}
                    >
                      <div className="text-[11px] font-bold text-tasi flex items-center gap-x-1">
                        {msg.from}
                        {member && (
                          <span>
                            <BsPatchCheckFill />
                          </span>
                        )}
                      </div>

                      <div>{msg.text}</div>
                    </div>
                    <span className="text-[12px]">
                      {getTime(msg.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div
        id="sendBox"
        ref={sendBox}
        className={
          !messages
            ? "h-fit w-full border-t bg-blue-200 opacity-0"
            : "h-fit w-full border-t bg-blue-200"
        }
      >
        <form
          action=""
          autocomplete="off"
          className="flex gap-x-3 items-center p-2"
        >
          <input
            id="input_area"
            ref={messageBoxRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            // type="search"
            className="flex-1 w-full border px-2 py-1 outline-none "
            placeholder="??????????????..."
            aria-autocomplete="both"
            aria-haspopup="false"
            autocomplete="off"
          />
          <button
            onClick={(e) => sendMessage(e)}
            className="flex items-center gap-x-2 border-2 px-3 py-1 text-white bg-tasi"
          >
            <span className="hidden md:block">????????</span>
            <AiOutlineSend size={18} className="scale-x-[-1]" />
          </button>
        </form>
        <div className="w-full flex items-center justify-between py-2 bg-blue-200">
          <div className="px-3 my-auto h-fit">
            <p className="font-semibold text-[16px] md:text-[20px]">
              ???????????? ???????????? - TASI
            </p>
          </div>
          <div className="flex items-center gap-x-2 px-3 my-auto h-fit">
            <div className="w-8 h-8 p-2 rounded-full bg-slate-700 text-white flex items-center justify-center relative">
              {our_user.from === null ? (
                ""
              ) : our_user.image === "" || our_user.image === null ? (
                our_user?.from[0]?.toUpperCase()
              ) : (
                <Image
                  className="rounded-full"
                  alt="/"
                  src={our_user?.image}
                  fill
                />
              )}
            </div>
            <div>
              <Link href="/">
                <div className="flex items-center gap-x-1 py-[1px] px-1 md:px-2 bg-gray-50 rounded">
                  <span className="hidden md:block">????????????</span>
                  <IoEnterOutline className="scale-x-[-1]" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="fixed h-[50px] md:h-fit md:sticky w-full bottom-0 left-0 right-0 p-2 border-t bg-blue-200 z-[99]">
        <form
          action=""
          autocomplete="off"
          className="flex gap-x-3 items-center"
        >
          <input
            id="input_area"
            ref={messageBoxRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            // type="search"
            className="flex-1 w-full border px-2 py-1 outline-none "
            placeholder="??????????????..."
            aria-autocomplete="both"
            aria-haspopup="false"
            autocomplete="off"
          />
          <button
            onClick={(e) => sendMessage(e)}
            className="flex items-center gap-x-2 border-2 px-3 py-1 text-white bg-tasi"
          >
            <span className="hidden md:block">????????</span>
            <AiOutlineSend size={18} className="scale-x-[-1]" />
          </button>
        </form>
      </div> */}
    </div>
  );
};

export default MobileRoom;
