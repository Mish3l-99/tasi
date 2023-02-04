import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { IoEnterOutline } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../firebase";

const UserDetails = () => {
  const { userData, user, setUserData } = useAuth();

  const [loading, setLoading] = useState(false);
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

  const handleUpdateImage = async (e) => {
    e.preventDefault();

    if (e.target[0].files === null) {
      toast.error("لا يوجد ملف !");
    } else {
      const file = e.target[0].files[0];
      uploadFiles(file);
    }
  };

  useEffect(
    () =>
      onSnapshot(doc(db, "users", user.uid), (snapshot) => {
        setUserData((userData) => ({
          ...userData,
          image: "/icons/loading.gif",
        }));
        setUserData(snapshot.data());
      }),
    []
  );

  return (
    <div className="py-8 mb-24">
      <div className="container">
        <div className="flex flex-col gap-y-4">
          <div className="flex gap-x-4 md:gap-x-8 items-start">
            <div className="w-24 h-24 md:w-36 md:h-36 p-2 rounded-full bg-slate-700 text-white flex items-center justify-center relative">
              {userData.image ? (
                <Image
                  className="rounded-full"
                  alt="/"
                  src={userData?.image}
                  fill
                />
              ) : (
                <div className="p-6 text-lg">
                  {userData.username[0].toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold">
                {userData.username}
              </p>
              <p className="text-lg md:text-xl">{userData.email}</p>
            </div>
          </div>
          <div className="pt-4 border-t">
            <p>تحديث الصورة الشخصية :</p>
            <form
              action=""
              onSubmit={handleUpdateImage}
              className="mt-4 flex gap-x-2 w-full md:max-w-[300px]"
            >
              <input type="file" className="flex-1" />
              <button
                type="submit"
                className="py-[2px] px-3 bg-tasi text-white flex items-center gap-x-2"
              >
                تحديث
                {loading && (
                  <Image
                    alt="/"
                    src="/icons/loading.gif"
                    height={17}
                    width={17}
                  />
                )}
              </button>
            </form>
          </div>
          <div className="mt-4 flex gap-x-8 items-center ">
            <Link href="/room">
              <button className="bg-tasi px-2 py-[2px] text-white rounded flex items-center gap-x-2 hover:bg-green-900 duration-500">
                الدخول للمحادثة
                <IoEnterOutline className="scale-x-[-1]" />
              </button>
            </Link>
            <Link href="/">
              <span className="underline hover:text-tasi">العودة</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
