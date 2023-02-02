import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiFillDownSquare, AiFillUpSquare } from "react-icons/ai";
import { BsTwitter } from "react-icons/bs";
import { CiDiscount1 } from "react-icons/ci";
import { MdHowToVote } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";

function getDate(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp);
  var year = a.getFullYear();
  var month = a.getMonth() + 1;
  var date = a.getDate();
  if (month <= 9) {
    month = "0" + month;
  }
  if (date <= 9) {
    date = "0" + date;
  }
  // var hour = a.getHours();
  // var min = a.getMinutes();
  var time = date + "-" + month + "-" + year;
  return time;
}

const Voting = () => {
  const [voting, setVoting] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, userData, updateUserLastV } = useAuth();

  const getVoting = async () => {
    const todayDate = getDate(new Date().getTime());
    const todayDoc = await getDoc(doc(db, "voting", todayDate));

    // setVoting(todayDoc.data());
    if (todayDoc.exists()) {
      const total = todayDoc.data().voters_up + todayDoc.data().voters_down;
      const up = Math.round((todayDoc.data().voters_up * 100) / total);
      const down = Math.round((todayDoc.data().voters_down * 100) / total);

      setVoting({ up, down, total });
    } else {
      await setDoc(doc(db, "voting", todayDate), {
        voters_up: 0,
        voters_down: 0,
      });
      // setVoting({ up: 50, down: 50, total: 0 });
    }
  };

  useEffect(() => {
    setVoting();
    setShow(false);
    // localStorage.clear();
  }, [userData]);

  useEffect(() => {
    getVoting();
  }, [show]);

  // const firstV = () => {
  //   const timeNow = new Date().getTime();
  //   const todayDate = getDate(timeNow);
  //   getDoc(doc(db, "voting", todayDate)).then((res) => {
  //     return !res.exists();
  //   });
  // };

  const allowedV = () => {
    const timeNow = new Date().getTime();
    const todayDate = getDate(timeNow);
    if (userData !== null) {
      const lastVDate = getDate(userData.lastVoted);

      return lastVDate !== todayDate;
    } else {
      const res = localStorage.getItem("lastVDate");
      if (res === null || res !== todayDate) {
        localStorage.setItem("lastVDate", todayDate);
        return true;
      } else {
        return false;
      }
    }
  };

  const voteUp = async () => {
    setLoading(true);
    const todayDate = getDate(new Date().getTime());
    if (allowedV()) {
      const todayDoc = await getDoc(doc(db, "voting", todayDate));
      const newVotersUp = todayDoc.data().voters_up + 1;
      const newFields = { voters_up: newVotersUp };
      await updateDoc(doc(db, "voting", todayDate), newFields);
      updateUserLastV();
    } else {
      toast.error("يتاح التصويت مرة باليوم !");
    }
    setShow(true);
    setLoading(false);
  };

  const voteDown = async () => {
    setLoading(true);
    const todayDate = getDate(new Date().getTime());
    if (allowedV()) {
      const todayDoc = await getDoc(doc(db, "voting", todayDate));
      const newVotersDown = todayDoc.data().voters_down + 1;
      const newFields = { voters_down: newVotersDown };
      await updateDoc(doc(db, "voting", todayDate), newFields);
      updateUserLastV();
    } else {
      toast.error("يتاح التصويت مرة باليوم !");
    }
    setShow(true);
    setLoading(false);
  };

  // console.log(voting);

  return (
    <div className="w-full flex-1 p-4 shadow-md">
      <div className="flex items-center justify-between text-xl mb-8">
        <div>
          <div className="flex items-center gap-x-2">
            <span>
              <MdHowToVote />
            </span>
            <h1>التصويت :</h1>
          </div>
          <div className="flex items-center gap-x-1 text-sm">
            <CiDiscount1 />
            <span className="flex items-center gap-x-2">
              عدد المصوتين :{" "}
              {loading ? (
                <div>
                  <Image
                    alt="/"
                    src="/icons/loading.gif"
                    height={15}
                    width={15}
                    className="mx-auto"
                  />
                </div>
              ) : (
                voting && <span>{voting.total}</span>
              )}
            </span>
          </div>
        </div>
        <div>
          <a
            href={`https://twitter.com/intent/tweet?url=https%3A%2F%2Ftasitalk.com&text=TASI%20Talk%20is%20Awesome%2C%20please%20check%20it%20out%20%3A%20`}
            target="_blank"
            rel="noreferrer"
          >
            <span
              dir="ltr"
              className="py-[1px] text-sm px-3 text-white rounded-full bg-[#1DA1F2] flex items-center gap-x-2 hover:shadow-md"
            >
              <BsTwitter />
              Tweet
            </span>
          </a>
        </div>
      </div>
      <div className="flex items-center gap-x-2">
        <div>
          <span
            onClick={() => voteUp()}
            className="text-green-500 text-xl md:text-2xl cursor-pointer hover:text-green-700"
          >
            <AiFillUpSquare />
          </span>
          <span
            onClick={() => voteDown()}
            className="text-red-500 text-xl md:text-2xl cursor-pointer hover:text-red-700"
          >
            <AiFillDownSquare />
          </span>
        </div>
        <div className="flex-1 h-8 bg-gray-400">
          {show && voting && (
            <div className="w-full flex h-8 text-white text-sm bg-gray-500">
              <div
                className="bg-green-600 h-full w-full flex items-center justify-center"
                style={{
                  width: `${voting.up}%`,
                }}
              >
                {voting.up !== 0 ? `%${voting.up}` : ""}
              </div>
              <div
                className="bg-red-600 h-full w-full flex items-center justify-center"
                style={{
                  width: `${voting.down}%`,
                }}
              >
                {voting.down !== 0 ? `%${voting.down}` : ""}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Voting;
