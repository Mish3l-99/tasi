import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Loading from "./Loading";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { IoEnterOutline } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../firebase";
import { MdSystemUpdateAlt } from "react-icons/md";
import { AiOutlineFileImage } from "react-icons/ai";

const UserDetails = ({ user }) => {
  const {
    updateUserData,
    logout,
    updateCredentials,
    updateUserPassword,
    ended,
  } = useAuth();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    pass: "",
    pass_2: "",
    username: user?.username,
    email: user?.email,
  });

  useEffect(() => {
    setLoading(false);
  }, [ended]);

  const [progress, setProgress] = useState();

  const uploadFiles = async (file) => {
    //
    const toastId = toast.loading("جاري رفع الصورة ... ");

    if (!file) {
      toast.error("خطأ !", {
        id: toastId,
      });
      return;
    }

    setLoading(true);

    const sotrageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(sotrageRef, file);

    uploadTask.on(
      "state_changed",

      /// to show the percentage of uploading images

      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
      },

      //   this thing to check error during process
      (error) => console.log(error),

      // this function to get or download url back apps
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          updateDoc(doc(db, "users", user.uid), { image: downloadURL }).then(
            (res) => {
              toast.success("تم تحديث الصورة !", {
                id: toastId,
              });
              setLoading(false);
            }
          );
        });
      }
    );
  };

  const handleUpdateData = async (e) => {
    e.preventDefault();

    if (form.username === "" || form.email === "") {
      // toast.error("حقول فارغة !");
      setLoading(false);
    } else {
      setLoading(true);
      updateCredentials(form);
    }

    if (form.pass !== "") {
      if (form.pass.length < 8) {
        toast.error("كلمة سر قصيرة !");
        setLoading(false);
      } else if (form.pass !== form.pass_2) {
        toast.error("كلمة سر غير متطابقة !");
        setLoading(false);
      } else {
        setLoading(true);
        updateUserPassword(form.pass);
      }
    }

    const file = e.target[0].files[0];

    if (file) {
      uploadFiles(file);
    }

    // if (e.target[0].files === null) {
    //   toast.error("لا يوجد ملف !");
    // } else {
    //   const file = e.target[0].files[0];
    //   uploadFiles(file);
    // }
  };

  useEffect(
    () =>
      onSnapshot(doc(db, "users", user.uid), (snapshot) => {
        updateUserData(snapshot.data());
      }),
    []
  );

  const onTyping = (e) => {
    setForm((form) => ({ ...form, [e.target.name]: e.target.value }));
  };

  const enterRoom = () => {
    window.location.href = "/room";
  };

  return (
    <div className="py-8 mb-24">
      <div className="container">
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col md:flex-row gap-x-4 md:gap-x-8 items-center justify-center md:items-start">
            <div className="mb-2 w-24 h-24 md:w-36 md:h-36 p-2 rounded-full bg-slate-700 text-white flex items-center justify-center relative">
              {user.image ? (
                <Image
                  className="rounded-full z-[998]"
                  alt="/"
                  src={user?.image}
                  fill
                />
              ) : (
                <div className="p-6 text-lg">
                  {user?.username[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-col items-center md:items-start">
              <p className="text-xl md:text-2xl font-bold">{user.username}</p>
              <p className="text-lg md:text-xl">{user.email}</p>
            </div>
          </div>
          <div className="pt-4 border-t flex flex-col justify-center items-center">
            <p className="font-semibold text-lg">تحديث البيانات</p>
            <form
              action=""
              onSubmit={handleUpdateData}
              className="mt-4 gap-x-2 w-full flex flex-col items-center gap-y-2"
            >
              <div className="grid grid-cols-6">
                <div className="col-span-2">صورة الملف :</div>
                <div className="col-span-4 relative">
                  <input
                    type="file"
                    className="w-full opacity-0 "
                    id="img_file"
                  />
                  <div className="w-full absolute top-0 h-full">
                    <label
                      htmlFor="img_file"
                      className="w-full h-full shadow py-[1px] px-3 rounded bg-gray-100 flex gap-x-2 items-center hover:cursor-pointer"
                    >
                      إختيار ملف
                      <AiOutlineFileImage />
                    </label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-6 items-center">
                <div className="col-span-2">إسم المستخدم :</div>
                <div className="col-span-4">
                  <input
                    onChange={(e) => onTyping(e)}
                    name="username"
                    value={form.username}
                    type="text"
                    className="w-full border outline-none px-2 py-[2px]"
                    placeholder="إسم المستخدم..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-6 items-center">
                <div className="col-span-2">البريد الالكتروني :</div>
                <div className="col-span-4">
                  <input
                    onChange={(e) => onTyping(e)}
                    name="email"
                    value={form.email}
                    type="email"
                    className="w-full border outline-none px-2 py-[2px]"
                    placeholder="البريد الالكتروني..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-6 items-center">
                <div className="col-span-2">كلمة المرور :</div>
                <div className="col-span-4">
                  <input
                    onChange={(e) => onTyping(e)}
                    name="pass"
                    type="password"
                    placeholder="****"
                    className="w-full border outline-none px-2 py-[2px]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-6 items-center">
                <div className="col-span-2">تأكيد كلمة المرور :</div>
                <div className="col-span-4">
                  <input
                    onChange={(e) => onTyping(e)}
                    name="pass_2"
                    type="password"
                    placeholder="****"
                    className="w-full border outline-none px-2 py-[2px]"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="py-[1px] px-3 bg-blue-600 rounded text-white flex items-center gap-x-2 relative"
              >
                تحديث
                {loading ? (
                  <Image
                    alt="/"
                    src="/icons/loading.gif"
                    height={16}
                    width={16}
                  />
                ) : (
                  <MdSystemUpdateAlt className="rotate-[180deg]" />
                )}
              </button>
            </form>
          </div>
          <div className="mt-4 flex gap-x-8 items-center justify-center">
            <button
              onClick={() => enterRoom()}
              className="bg-tasi px-2 py-[2px] text-white rounded flex items-center gap-x-2 hover:bg-green-900 duration-500"
            >
              الدخول للمحادثة
              <IoEnterOutline className="scale-x-[-1]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
