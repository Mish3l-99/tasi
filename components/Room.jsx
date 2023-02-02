import {
  addDoc,
  collection,
  orderBy,
  limit,
  onSnapshot,
  query,
} from "firebase/firestore";
import Router, { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
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

const Room = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const router = useRouter();

  const { userData, user, tempUser } = useAuth();

  const our_user = userData
    ? { user: user.uid, from: userData.username }
    : tempUser;

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

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (our_user === null) {
    router.replace("/");
    return;
  }

  return (
    <div dir="rtl" className="h-screen w-full flex flex-col">
      {/* first */}
      <div className="pb-2 border-b flex items-center justify-between bg-gray-200 p-3">
        <div>
          <p className="font-semibold text-[18px] text-tasi">
            محادثة مباشرة - TASI
          </p>
        </div>
        <div className="w-8 h-8 p-2 rounded-full bg-slate-700 text-white flex items-center justify-center">
          {our_user.from[0].toUpperCase()}
        </div>
      </div>
      {/* messages box */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
        {messages?.map((msg, i) => {
          let clas = msg.user === our_user.user ? "me_mssg" : "else_mssg";

          return (
            <div key={i} className={`mssg ${clas}`}>
              <p className="w-8 h-8 p-2 rounded-full bg-slate-700 text-white flex items-center justify-center">
                {msg.from[0].toUpperCase()}
              </p>
              <div>
                <div>{msg.text}</div>
                <span>
                  {msg.from} - {getTime(msg.createdAt - 9000000)}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-2 bg-gray-200 border-t">
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
