import React, { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoEnterOutline } from "react-icons/io5";
import { BiLogIn } from "react-icons/bi";
import { BsExclamationCircleFill } from "react-icons/bs";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";

function getTime(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp);

  var hour = a.getHours();
  var min = a.getMinutes();
  var time = hour + ":" + min;
  return time;
}

const MiniRoom = () => {
  let [modal, setModal] = useState(false);
  let [userField, setUserField] = useState("");
  const [messages, setMessages] = useState([]);

  const router = useRouter();

  const enterRoom = () => {
    if (userData) {
      router.push("/room");
    } else {
      openModal();
    }
  };

  const getToRoom = () => {
    fillTempUser(userField);
    router.push("/room");
  };

  function closeModal() {
    setModal(false);
  }

  function openModal() {
    setModal(true);
  }

  const { userData, user, tempUser, fillTempUser } = useAuth();

  const our_user = userData
    ? { user: user.uid, from: userData.username }
    : tempUser;

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

  return (
    <>
      <div className="flex-1 w-full p-3 shadow-lg rounded-md flex flex-col gap-y-2 bg-gray-50">
        {/* first */}
        <div className="pb-2 border-b flex items-center justify-between">
          <div>
            <p className="font-semibold text-[18px]">محادثة مباشرة</p>
          </div>
          <div className="w-8 h-8 p-2 rounded-full bg-slate-700 text-white flex items-center justify-center">
            {our_user?.from[0].toUpperCase()}
          </div>
        </div>
        {/* messages box */}
        <div
          className="h-[400px] overflow-y-auto p-2 scrollbar-hide"
          id="messages-container"
        >
          {messages?.map((msg, i) => {
            let clas = "else_mssg";
            if (our_user !== null) {
              clas = msg.user === our_user.user ? "me_mssg" : "else_mssg";
            }

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
        </div>
        {/* <div className="pt-2 border-t">
                <form action="" className="flex gap-x-3 items-center">
                  <input
                    type="text"
                    className="flex-1 border px-2 py-[2px] outline-none"
                    placeholder="الرسالة..."
                  />
                  <button className="flex items-center gap-x-2 border-2 px-3 py-[2px] text-white bg-tasi">
                    أرسل
                    <AiOutlineSend className="scale-x-[-1]" />
                  </button>
                </form>
              </div> */}
        <div className="pt-2 border-t flex justify-center items-center">
          <button
            onClick={() => enterRoom()}
            className="bg-tasi px-2 py-[2px] text-white rounded flex items-center gap-x-2 hover:bg-green-900 duration-500"
          >
            الدخول للمحادثة
            <IoEnterOutline className="scale-x-[-1]" />
          </button>
        </div>
      </div>
      {/* modal */}
      <Transition appear show={modal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[9999]"
          dir="rtl"
          onClose={closeModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0">
            <div className="flex min-h-full items-start justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white p-4 text-right shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold pb-2 border-b leading-6 text-gray-900"
                  >
                    الدخول لغرفة المحادثة
                  </Dialog.Title>
                  <div className="mt-2">
                    <div className="my-3 p-2 flex items-center gap-x-2">
                      <BsExclamationCircleFill className="text-red-600" />
                      الرجاء كتابة إسم مستخدم لتتمكن من دخول المحادثة، أو قُم
                      بالتسجيل في الموقع.
                    </div>
                    <form action="" className="flex flex-col gap-y-3">
                      <input
                        onChange={(e) => setUserField(e.target.value)}
                        type="text"
                        className="outline-none py-[2px] px-2 border"
                        placeholder="إسم المستخدم..."
                      />
                    </form>
                  </div>

                  <div className="mt-4 pt-2 border-t flex justify-center">
                    <button
                      type="button"
                      className="justify-center rounded-md border border-transparent bg-green-200 text-green-900 px-4 py-[2px] text-sm hover:bg-tasi hover:text-white duration-500 flex items-center gap-x-1"
                      onClick={() => getToRoom()}
                    >
                      الدخول
                      <BiLogIn className="scale-x-[-1]" />
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default MiniRoom;
