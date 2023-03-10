import Head from "next/head";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Main from "../components/Main";
import About from "../components/About";
import Footer from "../components/Footer";
import { clearAllBodyScrollLocks } from "body-scroll-lock";
import { useEffect } from "react";
// import axios from "axios";

export default function Home() {
  // useEffect(() => {
  //   clearAllBodyScrollLocks();
  // }, []);

  return (
    <div className="">
      <Head>
        <title>TASI Talk</title>

        <link rel="icon" href="/logo/favi.png" />
      </Head>

      <main className="">
        <Navbar />
        <Hero />
        <Main />
        <About />
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

// export async function getServerSideProps(context) {
//   const url = "https://www.google.com/finance/info?q=TADAWUL:TASI&callback=?";

//   // const res = await fetch(url);
//   const res = await axios.get(url);

//   console.log(res);

//   // finalData = res.data.results;
//   return {
//     props: {}, // will be passed to the page component as props
//   };
// }
