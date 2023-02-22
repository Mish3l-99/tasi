import React from "react";
import Navbar from "../components/Navbar";
import About from "../components/About";
import Footer from "../components/Footer";
import Signin from "../components/Signin";

const LoginPage = () => {
  return (
    <div>
      <Navbar />
      <Signin />
      <About />
      <Footer />
    </div>
  );
};

export default LoginPage;
