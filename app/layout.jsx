"use client";
import "./globals.css";
import { NextAuthProvider as SessionProvider } from "./component/Sessionprovider";
import { ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Stairs from "./component/Staris";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <title>Venue-vista</title>
      <body className=" relative min-h-screen">
        <link rel="icon" href="/logo.jpg" />

  <div className="site-bg" />
        <SessionProvider>
          <Stairs>{children}</Stairs>
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Flip}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
