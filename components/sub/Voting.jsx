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
import { AiOutlineDownCircle, AiOutlineUpCircle } from "react-icons/ai";
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

  const [voted, setVoted] = useState("none");

  const { user, updateUserLastV } = useAuth();

  const userVoteGetting = () => {
    // get actual user vote
    const todayDate = getDate(new Date().getTime());

    if (user !== null) {
      const lastVDate = getDate(new Date(user.lastVoted).getTime());
      if (lastVDate === todayDate) {
        setVoted(localStorage.getItem("voted"));
        setShow(true);
      }
    } else {
      const lastVDate = localStorage.getItem("lastVDate");
      if (lastVDate === todayDate) {
        setVoted(localStorage.getItem("voted"));
        setShow(true);
      }
    }
  };

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
      if (validDay()) {
        await setDoc(doc(db, "voting", todayDate), {
          voters_up: 0,
          voters_down: 0,
        });
        // setVoting({ up: 50, down: 50, total: 0 });
      }
    }

    // actual user vote showing if voted today
    userVoteGetting();
  };

  useEffect(() => {
    setVoting();
    setShow(false);
    // localStorage.clear();
  }, [user]);

  useEffect(() => {
    getVoting();
  }, [show, user]);

  // const firstV = () => {
  //   const timeNow = new Date().getTime();
  //   const todayDate = getDate(timeNow);
  //   getDoc(doc(db, "voting", todayDate)).then((res) => {
  //     return !res.exists();
  //   });
  // };

  const validDay = () => {
    const dayName = new Date().toLocaleString("en-us", {
      weekday: "long",
    });
    if (dayName === "Friday" || dayName === "Saturday") {
      return false;
    } else {
      return true;
    }
  };

  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  const handleTweet = () => {
    if (voted !== "none" && voting) {
      const url = `https://twitter.com/intent/tweet?url=https%3A%2F%2Ftasitalk.com&text=????????????%20${
        voted === "up" ? "????????" : "????????"
      }%20????????%20????????%20(${voting.up}%25%20????????%20-%20${
        voting.down
      }%25%20????????%20)`;

      openInNewTab(url);
    } else {
      toast.error("???? ???????????????? ???????? !");
    }
  };

  const allowedV = () => {
    const timeNow = new Date().getTime();
    const todayDate = getDate(timeNow);
    if (user !== null) {
      // const res = localStorage.getItem("lastVDate");
      // if (res === null || res !== todayDate) {

      // } else {
      //   return false;
      // }

      const lastVDate = getDate(user.lastVoted);
      return !(lastVDate === todayDate);
      // localStorage.setItem("lastVDate", todayDate);
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
    if (validDay()) {
      setLoading(true);
      if (localStorage.getItem("voted") !== null) {
        setVoted(localStorage.getItem("voted"));
      }

      const todayDate = getDate(new Date().getTime());
      if (allowedV()) {
        const todayDoc = await getDoc(doc(db, "voting", todayDate));
        const newVotersUp = todayDoc.data().voters_up + 1;
        const newFields = { voters_up: newVotersUp };
        await updateDoc(doc(db, "voting", todayDate), newFields);
        updateUserLastV();
        setVoted("up");
        localStorage.setItem("voted", "up");
      } else {
        toast.error("???????? ?????????????? ?????? ???????????? !");
      }

      setShow(true);
      setLoading(false);
    } else {
      toast.error("?????????????? ?????? ???????? ?????????? !");
    }
  };

  const voteDown = async () => {
    if (validDay()) {
      setLoading(true);
      if (localStorage.getItem("voted") !== null) {
        setVoted(localStorage.getItem("voted"));
      }
      const todayDate = getDate(new Date().getTime());
      if (allowedV()) {
        const todayDoc = await getDoc(doc(db, "voting", todayDate));
        const newVotersDown = todayDoc.data().voters_down + 1;
        const newFields = { voters_down: newVotersDown };
        await updateDoc(doc(db, "voting", todayDate), newFields);
        updateUserLastV();
        setVoted("down");
        localStorage.setItem("voted", "down");
      } else {
        toast.error("???????? ?????????????? ?????? ???????????? !");
      }
      setShow(true);
      setLoading(false);
    } else {
      toast.error("?????????????? ?????? ???????? ?????????? !");
    }
  };

  // console.log();

  return (
    <div className="w-full flex-1 p-4 bg-blue-200">
      <div className="flex items-center justify-between text-xl mb-8">
        <div>
          <div className="flex items-center gap-x-2">
            <span>
              <MdHowToVote />
            </span>
            <h1>?????????????? :</h1>
          </div>
          <div className="flex items-center gap-x-1 text-sm">
            <CiDiscount1 />
            <span className="flex items-center gap-x-2">
              ?????? ???????????????? :{" "}
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
          <button
            onClick={() => handleTweet()}
            className="py-[2px] text-sm px-3 text-white rounded-full bg-[#1DA1F2] flex items-center gap-x-2 hover:shadow-md"
          >
            <BsTwitter />
            ????????????
          </button>
        </div>
      </div>
      <div className="">
        <div className="mb-3">
          <p>???? ?????????? ?????????????????? ?????????? ???????? ???? ???????? ??</p>
        </div>
        <div className="flex items-center justify-between gap-x-4">
          <div
            onClick={() => voteUp()}
            className={
              voted === "up" ? "group up_voted bg-green-500" : "group up_voted"
            }
          >
            <AiOutlineUpCircle
              className={
                voted === "up"
                  ? "text-black group-hover:text-black"
                  : "text-green-500 group-hover:text-black"
              }
            />
            ????????
          </div>

          <div className="hidden lg:block flex-1 w-full h-8 bg-gray-400">
            {show && voting && !isNaN(voting.up) && (
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
          <div
            onClick={() => voteDown()}
            className={
              voted === "down"
                ? "group down_voted bg-red-500"
                : "group down_voted"
            }
          >
            <AiOutlineDownCircle
              className={
                voted === "down"
                  ? "text-black group-hover:text-black"
                  : "text-red-500 group-hover:text-black"
              }
            />
            ????????
          </div>
        </div>
        <div className="mt-2 lg:hidden flex-1 w-full h-8 bg-gray-400">
          {show && voting && !isNaN(voting.up) && (
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
