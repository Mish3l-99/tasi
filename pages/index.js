import Head from "next/head";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Main from "../components/Main";
import About from "../components/About";
import Footer from "../components/Footer";
// import axios from "axios";

export default function Home() {
  return (
    <div className="">
      <Head>
        <title>TASI Talk</title>
        <meta
          name="description"
          content="This is the number one platform in talking about stocks and trading in Saudi"
        />
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
