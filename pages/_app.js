import "../styles/globals.css";
import { AuthContextProvider } from "../context/AuthContext";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <Component {...pageProps} />
      <Toaster />
    </AuthContextProvider>
  );
}

export default MyApp;
