import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BiLogIn } from "react-icons/bi";
import { RiLockPasswordLine } from "react-icons/ri";

import { HiLogin } from "react-icons/hi";
import { FiLogIn, FiUserPlus } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { BsCheck2Circle } from "react-icons/bs";

const Signin = () => {
  const [mode, setMode] = useState("login");
  const router = useRouter();
  useEffect(() => {
    setMode(router.query.mode);
  }, [router.query]);

  return (
    <div className="w-full">
      <div className="container">
        {mode === "login" ? (
          <Login />
        ) : mode === "register" ? (
          <Register />
        ) : mode === "success" ? (
          <Success />
        ) : (
          <Forgot />
        )}
      </div>
    </div>
  );
};

export default Signin;

const Login = () => {
  let [passVisible, setPassVisible] = useState(false);
  let [loading, setLoading] = useState(false);
  let [form, setForm] = useState({ email: "", pass: "" });

  const { login, ended } = useAuth();
  // const { user, signup, login, logout, ended, resetPass } = useAuth();

  const updateLog = (e) => {
    setForm((form) => ({ ...form, [e.target.name]: e.target.value }));
  };

  const handleLogin = () => {
    setLoading(true);
    if (form.email === "" || form.pass === "") {
      toast.error("حقول فارغة !");
      setLoading(false);
    } else {
      login(form);
    }
  };

  useEffect(() => {
    setLoading(false);
  }, [ended]);

  return (
    <div className="py-4 w-full">
      <div className="md:max-w-[450px] md:mx-auto border shadow-md p-3">
        <div className="flex items-center gap-x-2 text-lg md:text-xl font-bold mb-6">
          <HiLogin />
          <h1 className="">تسجيل الدخول</h1>:
        </div>
        <hr className="my-2" />
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
              className="outline-none py-[2px] px-2 border w-full"
              placeholder="كلمة المرور..."
            />
            <div className="absolute left-3 top-0 h-full">
              {/* <AiOutlineEye /> */}
              <div
                onClick={() => setPassVisible(!passVisible)}
                className="flex items-center justify-center h-full"
              >
                {passVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </div>
            </div>
          </div>
        </form>
        <div>
          <button
            onClick={() => handleLogin()}
            className="mx-auto my-4 justify-center rounded-md border border-transparent bg-green-200 text-green-900 px-4 py-[2px] text-sm hover:bg-tasi hover:text-white duration-500 flex items-center gap-x-1"
          >
            الدخول
            {!loading ? (
              <BiLogIn className="scale-x-[-1]" />
            ) : (
              <Image alt="/" src="/icons/loading.gif" height={20} width={20} />
            )}
          </button>
        </div>
        <div>
          <Link href="/auth?mode=forgot">
            <button className="flex items-center gap-x-2 underline hover:text-tasi">
              <RiLockPasswordLine />
              هل نسيت كلمة السر ؟
            </button>
          </Link>
        </div>
        <div className="flex items-cenetr gap-x-2">
          <FiUserPlus />
          لست عضواً،
          <Link href="/auth?mode=register">
            <button className="flex items-center gap-x-2 underline hover:text-tasi">
              إنشاء حساب
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const Register = () => {
  let [passVisible, setPassVisible] = useState(false);
  let [loading, setLoading] = useState(false);

  const router = useRouter();

  const { signup, ended } = useAuth();

  let [form, setForm] = useState({
    username: "",
    email: "",
    pass: "",
    pass_2: "",
  });

  useEffect(() => {
    setLoading(false);
  }, [ended]);

  const updateReg = (e) => {
    setForm((form) => ({ ...form, [e.target.name]: e.target.value }));
  };

  const registerUser = () => {
    // e.preventDefault();

    setLoading(true);
    if (
      form.username === "" ||
      form.email === "" ||
      form.pass === "" ||
      form.pass_2 === ""
    ) {
      toast.error("حقول فارغة !");
      setLoading(false);
    } else if (form.pass !== form.pass_2) {
      toast.error("كلمة سر غير متطابقة !");
      setLoading(false);
    } else if (form.pass.length < 8) {
      toast.error("كلمة سر قصيرة !");
      setLoading(false);
    } else {
      // // here goes sign up
      // // random 4 digits number
      // var codeRandom = Math.floor(1000 + Math.random() * 9000);

      signup(form);
      // signup(regForm, codeRandom).then(() => {
      //   setVerify(true);
      //   setStoredCode(codeRandom);
      // });
    }
  };

  console.log(router.asPath);

  return (
    <div className="py-4 w-full">
      <div className="md:max-w-[450px] md:mx-auto border shadow-md p-3">
        <div className="flex items-center gap-x-2 text-lg md:text-xl font-bold mb-6">
          <FiUserPlus />
          <h1 className="">التسجيل</h1>:
        </div>
        <hr className="my-2" />
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
              className="outline-none py-[2px] px-2 border w-full"
              placeholder="كلمة المرور..."
            />
            <div className="absolute left-3 top-0 h-full">
              {/* <AiOutlineEye /> */}
              <div
                onClick={() => setPassVisible(!passVisible)}
                className="flex items-center justify-center h-full"
              >
                {passVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
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
        <div>
          <button
            onClick={() => registerUser()}
            className="mx-auto my-4 justify-center rounded-md border border-transparent bg-green-200 text-green-900 px-4 py-[2px] text-sm hover:bg-tasi hover:text-white duration-500 flex items-center gap-x-1"
          >
            التسجيل
            {!loading ? (
              <BiLogIn className="scale-x-[-1]" />
            ) : (
              <Image alt="/" src="/icons/loading.gif" height={20} width={20} />
            )}
          </button>
        </div>
        <div>
          <Link href="/auth?mode=forgot">
            <button className="flex items-center gap-x-2 underline hover:text-tasi">
              <RiLockPasswordLine />
              هل نسيت كلمة السر ؟
            </button>
          </Link>
        </div>
        <div className="flex items-center gap-x-2">
          <FiLogIn className="scale-x-[-1]" />
          بالفعل عضو،
          <Link href="/auth?mode=login">
            <button className="flex items-center gap-x-2 underline hover:text-tasi">
              الدخول
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const Forgot = () => {
  let [email, setEmail] = useState("");

  const { ended, resetPass } = useAuth();

  return (
    <div className="py-4 w-full">
      <div className="md:max-w-[450px] md:mx-auto border shadow-md p-3">
        <div className="flex items-center gap-x-2 text-lg md:text-xl font-bold mb-6">
          <RiLockPasswordLine />
          <h1 className="">استعادة كلمة السر</h1>:
        </div>
        <hr className="my-2" />
        <form action="" className="flex flex-col gap-y-3">
          <input
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            type="email"
            className="outline-none py-[2px] px-2 border"
            placeholder="البريد الإلكتروني..."
          />
        </form>
        <div>
          <button
            onClick={() => resetPass(email)}
            className="mx-auto my-4 justify-center rounded-md border border-transparent bg-green-200 text-green-900 px-4 py-[2px] text-sm hover:bg-tasi hover:text-white duration-500 flex items-center gap-x-1"
          >
            استعادة كلمة المرور
          </button>
        </div>
        <div>
          <Link href="/auth?mode=login">
            <button className="flex items-center gap-x-2 underline hover:text-tasi">
              <FiLogIn className="scale-x-[-1]" />
              الدخول
            </button>
          </Link>
        </div>
        <div className="flex items-center gap-x-2">
          <FiUserPlus />
          لست عضواً،
          <Link href="/auth?mode=register">
            <button className="flex items-center gap-x-2 underline hover:text-tasi">
              إنشاء حساب
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const Success = () => {
  return (
    <div className="py-4 w-full">
      <div className="md:max-w-[450px] md:mx-auto border shadow-md p-3 flex justify-center items-center">
        <div>
          <div className="text-4xl md:text-6xl text-tasi">
            <BsCheck2Circle />
          </div>
          <p className="text-xl md:text-2xl mt-4">تم بنجاح !</p>
        </div>
      </div>
    </div>
  );
};
