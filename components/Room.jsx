import {
  addDoc,
  collection,
  orderBy,
  limit,
  onSnapshot,
  query,
} from "firebase/firestore";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { AiOutlineSend } from "react-icons/ai";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";

function getTime(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp);

  var hour = a.getHours();
  var min = a.getMinutes();
  var time = hour + ":" + min;
  return time;
}

const Room = ({ our_user }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const router = useRouter();

  const { userData, user, tempUser } = useAuth();

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
    e.preventDefault();
    const readyMessage = filterMessage(message);
    setMessage("");
    if (readyMessage !== "") {
      const createdAt = new Date().getTime();
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
        }
      ),
    []
  );

  const scrollToBottom = () => {
    const objDiv = document.getElementById("messages-container");
    objDiv.scrollTop = objDiv.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // useEffect(() => {
  //   return (
  //     !ourUser &&
  //     setOurUser({
  //       user: localStorage.getItem("our_user_user"),
  //       from: localStorage.getItem("our_user_from"),
  //     })
  //   );
  // }, []);

  // if (our_user === null) {
  //   router.replace("/");
  //   return;
  // }

  console.log(our_user);

  return (
    <div dir="rtl" className="h-screen w-full flex flex-col overflow-auto">
      {/* first */}
      <div className="sticky w-full top-0 pb-2 border-b flex items-center justify-between bg-gray-200 p-3">
        <div>
          <p className="font-semibold text-[18px] text-tasi">
            محادثة مباشرة - TASI
          </p>
        </div>
        <div className="w-8 h-8 p-2 rounded-full bg-slate-700 text-white flex items-center justify-center relative">
          {our_user.image === "" ? (
            our_user.from[0].toUpperCase()
          ) : (
            <Image className="rounded-full" alt="/" src={our_user.image} fill />
          )}
        </div>
      </div>
      {/* messages box */}
      <div
        id="messages-container"
        className="sticky flex-1 overflow-y-auto p-2 scrollbar-hide"
      >
        {messages?.map((msg, i) => {
          let me = msg.user === our_user.user;
          let clas = me ? "bg-green-100" : "";

          return (
            <div
              key={i}
              dir={me ? "rtl" : "ltr"}
              className="flex items-start gap-x-1 mb-1"
            >
              <div className="w-8 h-8 p-2 rounded-full bg-slate-700 text-white flex items-center justify-center relative">
                {msg.from[0].toUpperCase()}
                {/* {our_user.image === "" ? (
                  our_user.from[0].toUpperCase()
                ) : (
                  <Image
                    className="rounded-full"
                    alt="/"
                    src={our_user.image}
                    fill
                  />
                )} */}
              </div>
              <div>
                <div
                  className={`px-2 py-[3px] border w-fit rounded flex flex-col ${clas} `}
                >
                  <div className="text-[11px] font-bold text-tasi">
                    {msg.from}
                  </div>

                  <div>{msg.text}</div>
                </div>
                <span className="text-[12px]">{getTime(msg.createdAt)}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="sticky w-full bottom-0 p-2 bg-gray-200 border-t">
        <form action="" className="flex gap-x-3 items-center">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            className="flex-1 border px-2 py-1 outline-none"
            placeholder="الرسالة..."
          />
          <button
            onClick={(e) => sendMessage(e)}
            className="flex items-center gap-x-2 border-2 px-3 py-1 text-white bg-tasi"
          >
            <span className="hidden md:block">أرسل</span>
            <AiOutlineSend size={21} className="scale-x-[-1]" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Room;
