import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { auth, db } from "../firebase";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [tempUser, setTempUser] = useState(null);

  const [ended, setEnded] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
        });
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setLocalParams = (from, user, image) => {
    let img = image;
    if (!image || image === null) {
      img = "";
    }
    localStorage.setItem("our_user_from", from);
    localStorage.setItem("our_user_user", user);
    localStorage.setItem("our_user_image", img);
  };

  useEffect(() => {
    if (userData !== null) {
      setLocalParams(userData.username, user.uid, userData.image);
    }
  }, [user]);
  // if(locale === "en")

  const signup = async (formData) => {
    try {
      const userRes = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.pass
      );
      const dataAll = {
        email: formData.email,
        username: formData.username,
        lastVoted: 0,
        image,
      };
      setUserData(dataAll);

      await setDoc(doc(db, "users", userRes.user.uid), dataAll).then((res) => {
        toast.success("تم التسجيل بنجاح !");
      });
    } catch (error) {
      console.log(error);
      if (error.code === "auth/invalid-email") {
        toast.error("Invalid Email !");
        setEnded(!ended);
      } else if (error.code === "auth/email-already-in-use") {
        toast.error("البريد الالكتروني موجود بالفعل، قم بتسجيل الدخول !");
        setEnded(!ended);
      } else {
        toast.error("حدث خطأ ما !");
        setEnded(!ended);
      }
    }
  };

  const login = async (loginForm) => {
    try {
      const loginRes = await signInWithEmailAndPassword(
        auth,
        loginForm.email,
        loginForm.pass
      );
      const data = await getDoc(doc(db, "users", loginRes.user.uid));
      setUserData(data.data());

      toast.success("تم الدخول بنجاح !");
    } catch (error) {
      console.log(error.code);
      if (error.code === "auth/wrong-password") {
        toast.error("كلمة سر خاطئة !");
        setEnded(!ended);
      } else if (error.code === "auth/user-not-found") {
        toast.error("الايميل غير موجود !");
        setEnded(!ended);
      } else {
        toast.error("حدث خطأ ما !");
        setEnded(!ended);
      }
    }

    // return signInWithEmailAndPassword(auth, email, password);
  };

  const updateUserLastV = async () => {
    if (userData) {
      const timeNow = new Date().getTime();
      await updateDoc(doc(db, "users", user.uid), { lastVoted: timeNow });
      setUserData((userData) => ({ ...userData, lastVoted: timeNow }));
    }
  };

  const fillTempUser = (uName) => {
    var uniq = uName + "/" + new Date().getTime();
    setTempUser({ from: uName, user: uniq });
    setLocalParams(uName, uniq, null);
  };

  const logout = async () => {
    setUser(null);
    setUserData(null);
    await signOut(auth);
    toast.success("تم تسجيل الخروج بنجاح !");
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        ended,
        tempUser,
        setUserData,
        fillTempUser,
        updateUserLastV,
        signup,
        login,
        logout,
      }}
    >
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
