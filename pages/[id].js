import Head from "next/head";
import React from "react";
import About from "../components/About";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import UserDetails from "../components/UserDetails";
import { useAuth } from "../context/AuthContext";

const UserPage = () => {
  const { user } = useAuth();
  return (
    <div>
      <Head>
        <title>TASI Talk</title>

        <link rel="icon" href="/logo/favi.png" />
      </Head>
      <main>
        <Navbar />
        {user === null ? <Loading /> : <UserDetails user={user} />}

        <About />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default UserPage;
