import Head from "next/head";
import React from "react";
import About from "../components/About";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import UserDetails from "../components/UserDetails";

const UserPage = () => {
  return (
    <div>
      <Head>
        <title>TASI Talk</title>

        <link rel="icon" href="/logo/favi.png" />
      </Head>
      <main>
        <Navbar />
        <UserDetails />
        <About />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default UserPage;
