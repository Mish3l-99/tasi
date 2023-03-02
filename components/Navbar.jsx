import Image from "next/image";
import React, { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
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
import Link from "next/link";
import { FiSettings } from "react-icons/fi";

const setLocalParams = (from, user, image) => {
  let img = image;
  if (!image || image === null) {
    img = "";
  }
  localStorage.setItem("our_user_from", from);
  localStorage.setItem("our_user_user", user);
  localStorage.setItem("our_user_image", img);
};

const Navbar = () => {
  const [nav, setNav] = useState(false);

  const router = useRouter();

  const { user } = useAuth();

  function headToUserPage(ID) {
    router.push("/" + ID);
  }
  function headToLoginPage(ID) {
    router.push("/auth?mode=login");
  }

  // to be triggered when loging in
  useEffect(() => {
    // setLocalParams(user?.username, user?.uid, user?.image);
    console.log(user);
  }, [user]);

  return (
    <div className="w-full py-2 bg-blue-200 shadow-sm shadow-gray-200">
      <div className="container">
        <nav className="flex justify-between items-center">
          <Link href="/">
            <Image
              src="/logo/logo-o.png"
              // src="/logo/logo.png"
              alt="/"
              height={70}
              width={150}
              className="object-cover z-[999]"
            />
          </Link>
          {user !== null ? (
            <div className="flex items-center gap-x-4">
              {/* <div
                onClick={() => headToUserPage(user.uid)}
                className="bg-blue-100 cursor-pointer border py-[2px] px-3 rounded flex items-center gap-x-2"
              >
                <AiOutlineUser />
                {user?.username}
              </div> */}
              <DropUser username={user?.username} />
            </div>
          ) : (
            <div dir="rtl" className="flex gap-x-4 items-center w-fit">
              <button
                onClick={() => headToLoginPage()}
                className="border px-3 py-[2px] bg-white text-black hover:text-tasi duration-500 ease-out flex items-center gap-x-1"
              >
                الدخول
                <BiLogIn className="scale-x-[-1]" />
              </button>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;

function DropUser({ username }) {
  const router = useRouter();

  const { user, logout } = useAuth();

  function headToUserPage(ID) {
    router.push("/" + ID);
  }

  return (
    <div className="">
      <Menu as="div" className="">
        <div>
          <Menu.Button className="bg-blue-100 cursor-pointer border py-[2px] px-3 rounded flex items-center gap-x-2">
            {username}
            <AiOutlineUser />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute left-2 mt-1 min-w-[160px] max-w-[200px] origin-top-left divide-y divide-gray-100 rounded bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1 z-[999]">
            <div className="px-1 py-1 ">
              <Menu.Item>
                <button
                  onClick={() => headToUserPage(user.uid)}
                  className="w-full flex justify-between items-center gap-x-2 px-1 py-[2px] rounded hover:text-white duration-100 ease-out hover:bg-tasi"
                >
                  الاعدادات
                  <FiSettings />
                </button>
              </Menu.Item>
              <Menu.Item>
                <button
                  onClick={() => logout()}
                  className="w-full flex justify-between items-center gap-x-2 px-1 py-[2px] rounded hover:text-white duration-100 ease-out hover:bg-tasi"
                >
                  الخروج
                  <BiLogOutCircle />
                </button>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
