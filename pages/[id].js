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
        <meta
          name="description"
          content="موقع تاسي توك يوفر منصة محادثة ودردشة حية ومباشرة لتبادل المعلومات والآراء بين المتداولين و المضاربين في سوق الأسهم السعودي (تداوُل) ونوفر أيضا نظام تصويت لأداء المؤشر يوميا مع إمكانية نشر التصويت على تويتر. Tasitalk is a platform for traders and investors in the Saudi Stock market (Tadawul) to chat, vote and exchange information in relation to the market. Traders also can vote for the performance of the market"
        />
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
