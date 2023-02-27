import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { auth, db } from "../firebase";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [ended, setEnded] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getDoc(doc(db, "users", user.uid)).then((res) => {
          if (res.exists()) {
            setUser({
              uid: user.uid,
              // email: user.email,
              ...res.data(),
            });

            // localStorage.clear();
          }
        });
      } else {
        setUser(null);
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
        image: null,
      };
      await setDoc(doc(db, "users", userRes.user.uid), dataAll).then((res) => {
        toast.success("تم التسجيل بنجاح !");
        router.push("/auth?mode=success");
      });

      // sign in a new to get actual data
      signInWithEmailAndPassword(auth, formData.email, formData.pass);
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

      console.log(loginRes.user.uid);

      toast.success("تم الدخول بنجاح !");
      router.push("/auth?mode=success");
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

  const updateUserData = async (newUser) => {
    setUser((user) => ({ ...user, ...newUser }));
  };

  const updateUserLastV = async () => {
    if (user) {
      const timeNow = new Date().getTime();
      await updateDoc(doc(db, "users", user.uid), { lastVoted: timeNow });
      setUser((user) => ({ ...user, lastVoted: timeNow }));
    }
  };

  const resetPass = async (email) => {
    if (email !== "") {
      const toastId = toast.loading("الرجاء الإنتظار....");
      sendPasswordResetEmail(auth, email)
        .then(() => {
          toast.success("تم إرسال بريد الكتروني لإستعادة كلمة المرور.", {
            id: toastId,
          });
          router.push("/auth?mode=success");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;

          if (errorCode === "auth/invalid-email") {
            toast.error("ايميل خاطئ", {
              id: toastId,
            });
          } else if (errorCode === "auth/user-not-found") {
            toast.error("ايميل غير موجود، قم بالتسجيل !", {
              id: toastId,
            });
          } else {
            toast.error("خطأ !", {
              id: toastId,
            });
          }

          console.log(errorMessage);
          // ..
        });
    } else {
      toast.error("حقل الايميل فارغ !");
    }
  };

  const fillLocalUser = (uName) => {
    if (uName !== localStorage.getItem("our_user_from")) {
      var uniq = uName + "/" + new Date().getTime();
      setLocalParams(uName, uniq, null);
    }
    // const localUser = {
    //   user: localStorage.getItem("our_user_user"),
    //   from: localStorage.getItem("our_user_from"),
    //   image: localStorage.getItem("our_user_image"),
    // };
    // console.log(uName, localUser);
  };

  const logout = async () => {
    setUser(null);
    await signOut(auth);
    toast.success("تم تسجيل الخروج بنجاح !");
    router.replace("/");
    return;
  };

  const updateUserPassword = async (newPass) => {
    updatePassword(auth.currentUser, newPass)
      .then(() => {
        console.log("password success");
        router.replace("/auth?mode=success");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateCredentials = async (form) => {
    if (form.email === user.email) {
      updateDoc(doc(db, "users", user.uid), {
        username: form.username,
      }).then((res) => {
        updateUserData({ username: form.username, email: form.email });
        toast.success("تم تحديث البيانات !");
        setEnded(!ended);
        router.replace("/auth?mode=success");
      });
    } else {
      updateEmail(auth.currentUser, form.email)
        .then(() => {
          console.log("email success");
          updateDoc(doc(db, "users", user.uid), {
            username: form.username,
            email: form.email,
          }).then((res) => {
            updateUserData({ username: form.username, email: form.email });
            toast.success("تم تحديث البيانات !");
            setEnded(!ended);
            router.replace("/auth?mode=success");
          });
        })
        .catch((err) => {
          console.log(err);
          toast.error("بريد الكتروني خاطيء!");
        });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        ended,
        resetPass,
        fillLocalUser,
        updateUserLastV,
        updateUserData,
        updateCredentials,
        updateUserPassword,
        signup,
        login,
        logout,
      }}
    >
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
