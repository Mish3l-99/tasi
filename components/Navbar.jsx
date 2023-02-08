import Image from "next/image";
import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { BiLogIn, BiLogOutCircle, BiUserPlus } from "react-icons/bi";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineUser,
} from "react-icons/ai";
import { HiMenuAlt1, HiX } from "react-icons/hi";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Router, { useRouter } from "next/router";

const setLocalParams = (from, user, image) => {
  let img = image;
  if (!image || image === null) {
    img = "";
  }
  localStorage.setItem("our_user_from", from);
  localStorage.setItem("our_user_user", user);
  localStorage.setItem("our_user_image", img);
};

const initReg = { username: "", email: "", pass: "", pass_2: "" };

const initLog = {
  email: "",
  pass: "",
};

const Navbar = () => {
  const [nav, setNav] = useState(false);
  let [modal, setModal] = useState(false);
  let [mode, setMode] = useState();

  let [passVisible, setPassVisible] = useState(false);

  const router = useRouter();

  let [regForm, setRegForm] = useState(initReg);
  let [logForm, setLogForm] = useState(initLog);
  let [loading, setLoading] = useState(false);

  const { user, signup, login, logout, ended, resetPass } = useAuth();

  useEffect(() => {
    setLoading(false);
  }, [ended]);

  useEffect(() => {
    closeModal();
    setLoading(false);
  }, [user]);

  function headToUserPage(ID) {
    router.push("/" + ID);
  }

  function closeModal() {
    setModal(false);
  }

  function openModal() {
    setModal(true);
  }

  function openLogin() {
    setMode("login");
    setModal(true);
  }
  function openRegister() {
    setMode("register");
    setModal(true);
  }

  function updateReg(e) {
    setRegForm((regForm) => ({ ...regForm, [e.target.name]: e.target.value }));
  }
  function updateLog(e) {
    setLogForm((logForm) => ({ ...logForm, [e.target.name]: e.target.value }));
  }

  const loginUser = (e) => {
    setLoading(true);
    if (logForm.email === "" || logForm.pass === "") {
      toast.error("حقول فارغة !");
      setLoading(false);
    } else {
      login(logForm);
    }
  };
  const registerUser = (e) => {
    e.preventDefault();

    setLoading(true);
    if (
      regForm.username === "" ||
      regForm.email === "" ||
      regForm.pass === "" ||
      regForm.pass_2 === ""
    ) {
      toast.error("حقول فارغة !");
      setLoading(false);
    } else if (regForm.pass !== regForm.pass_2) {
      toast.error("كلمة سر غير متطابقة !");
      setLoading(false);
    } else if (regForm.pass.length < 8) {
      toast.error("كلمة سر قصيرة !");
      setLoading(false);
    } else {
      // // here goes sign up
      // // random 4 digits number
      // var codeRandom = Math.floor(1000 + Math.random() * 9000);

      signup(regForm);
      // signup(regForm, codeRandom).then(() => {
      //   setVerify(true);
      //   setStoredCode(codeRandom);
      // });
    }
  };

  // to be triggered when loging in
  useEffect(() => {
    // setLocalParams(user?.username, user?.uid, user?.image);
    console.log(user);
  }, [user]);

  return (
    <div className="w-full py-2 bg-blue-200 shadow-sm shadow-gray-200">
      <div className="container">
        <nav className="flex flex-row-reverse justify-between items-center">
          <Image
            src="/logo/logo.png"
            alt="/"
            height={80}
            width={150}
            className="object-cover z-[999]"
          />
          {user !== null ? (
            <div className="hidden md:flex items-center gap-x-4">
              <span
                onClick={() => logout()}
                className="cursor-pointer hover:scale-105 duration-300"
              >
                <BiLogOutCircle className="scale-x-[-1]" />
              </span>
              <div
                onClick={() => headToUserPage(user.uid)}
                className="bg-blue-100 cursor-pointer border py-[2px] px-3 rounded flex items-center gap-x-2"
              >
                <AiOutlineUser />
                {user?.username}
              </div>
            </div>
          ) : (
            <div
              dir="rtl"
              className="hidden md:flex gap-x-4 items-center w-fit"
            >
              <button
                onClick={() => openRegister()}
                className="border px-3 py-[2px] bg-white hover:bg-tasi hover:text-white duration-500 ease-out flex items-center gap-x-1"
              >
                التسجيل
                <BiUserPlus />
              </button>
              <button
                onClick={() => openLogin()}
                className="border px-3 py-[2px] bg-tasi text-white hover:bg-white hover:text-tasi duration-500 ease-out flex items-center gap-x-1"
              >
                الدخول
                <BiLogIn className="scale-x-[-1]" />
              </button>
            </div>
          )}
          {/* mob nav */}
          <div className="md:hidden flex gap-x-2 items-center">
            <div onClick={() => setNav(!nav)}>
              {nav ? <HiX /> : <HiMenuAlt1 />}
            </div>
            {user !== null && (
              <div className="flex items-center justify-center gap-x-2 text-sm bg-blue-100">
                <div
                  onClick={() => headToUserPage(user.uid)}
                  className=" border py-[2px] px-3 rounded flex items-center gap-x-2"
                >
                  <AiOutlineUser />
                  {user?.username}
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* mob nav */}
      <div
        className={
          nav
            ? "shadow-lg fixed top-0 left-0 h-full w-[85%] bg-white transition-all flex flex-col ease-out duration-500 px-2 pt-16 md:hidden opacity-100 scale-1 z-[99]"
            : "shadow-lg fixed top-0 left-0 h-full w-[85%] bg-white transition-all flex flex-col ease-out duration-500 px-2 pt-16 md:hidden opacity-0 pointer-events-none ml-[-100%]"
        }
      >
        {user !== null ? (
          <div className="flex items-center justify-center gap-x-4">
            <span
              onClick={() => logout()}
              className="cursor-pointer hover:scale-105 duration-300"
            >
              <BiLogOutCircle className="scale-x-[-1]" />
            </span>
            <div
              onClick={() => headToUserPage(user.uid)}
              className=" border py-[2px] px-3 rounded flex items-center gap-x-2"
            >
              <AiOutlineUser />
              {user?.username}
            </div>
          </div>
        ) : (
          <div
            dir="rtl"
            className="mt-12 flex flex-col gap-y-4 items-center w-full"
          >
            <button
              onClick={() => openRegister()}
              className="w-full border px-3 py-[2px] bg-white hover:bg-tasi hover:text-white duration-500 ease-out flex items-center justify-center gap-x-1"
            >
              التسجيل
              <BiUserPlus />
            </button>
            <button
              onClick={() => openLogin()}
              className="w-full border px-3 py-[2px] bg-tasi text-white hover:bg-white hover:text-tasi duration-500 ease-out flex items-center justify-center gap-x-1"
            >
              الدخول
              <BiLogIn className="scale-x-[-1]" />
            </button>
          </div>
        )}
      </div>

      {/* modal */}
      <Transition appear show={modal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[999]"
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
                    {mode === "register" ? "التسجيل" : "تسجيل الدخول"}:
                  </Dialog.Title>
                  <div className="mt-2">
                    {mode === "register" ? (
                      <div>
                        <form action="" className="flex flex-col gap-y-3">
                          <input
                            onChange={(e) => updateReg(e)}
                            name="username"
                            type="text"
                            className="outline-none py-[2px] px-2 border"
                            placeholder="إسم المستخدم..."
                          />
                          <input
                            onChange={(e) => updateReg(e)}
                            name="email"
                            type="email"
                            className="outline-none py-[2px] px-2 border"
                            placeholder="البريد الإلكتروني..."
                          />
                          <div className="relative">
                            <input
                              onChange={(e) => updateReg(e)}
                              name="pass"
                              type={passVisible ? "text" : "password"}
                              className="outline-none py-[2px] px-2 border"
                              placeholder="كلمة المرور..."
                            />
                            <div className="absolute left-3 top-0 h-full">
                              {/* <AiOutlineEye /> */}
                              <div
                                onClick={() => setPassVisible(!passVisible)}
                                className="flex items-center justify-center h-full"
                              >
                                {passVisible ? (
                                  <AiOutlineEyeInvisible />
                                ) : (
                                  <AiOutlineEye />
                                )}
                              </div>
                            </div>
                          </div>
                          <input
                            onChange={(e) => updateReg(e)}
                            name="pass_2"
                            type="password"
                            className="outline-none py-[2px] px-2 border"
                            placeholder="تأكيد كلمة المرور..."
                          />
                        </form>
                      </div>
                    ) : (
                      <div>
                        <form action="" className="flex flex-col gap-y-3">
                          <input
                            onChange={(e) => updateLog(e)}
                            name="email"
                            type="email"
                            className="outline-none py-[2px] px-2 border"
                            placeholder="البريد الإلكتروني..."
                          />
                          <div className="relative">
                            <input
                              onChange={(e) => updateLog(e)}
                              name="pass"
                              type={passVisible ? "text" : "password"}
                              className="outline-none py-[2px] px-2 border"
                              placeholder="كلمة المرور..."
                            />
                            <div className="absolute left-3 top-0 h-full">
                              {/* <AiOutlineEye /> */}
                              <div
                                onClick={() => setPassVisible(!passVisible)}
                                className="flex items-center justify-center h-full"
                              >
                                {passVisible ? (
                                  <AiOutlineEyeInvisible />
                                ) : (
                                  <AiOutlineEye />
                                )}
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-2 border-t flex justify-center gap-x-4 items-center">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-200 text-green-900 px-4 py-[2px] text-sm hover:bg-tasi hover:text-white duration-500 flex items-center gap-x-1"
                      onClick={
                        mode === "register"
                          ? (e) => registerUser(e)
                          : (e) => loginUser(e)
                      }
                    >
                      {mode === "register" ? "التسجيل" : "الدخول"}

                      {!loading ? (
                        <BiLogIn className="scale-x-[-1]" />
                      ) : (
                        <Image
                          alt="/"
                          src="/icons/loading.gif"
                          height={20}
                          width={20}
                        />
                      )}
                    </button>
                    {mode === "login" && (
                      <button
                        onClick={() => resetPass(logForm.email)}
                        className="text-sm bg-white border px-2 p-[2px]"
                      >
                        استعادة كلمة المرور
                      </button>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Navbar;
