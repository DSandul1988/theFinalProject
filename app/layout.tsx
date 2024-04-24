import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nunito } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import NavigationBar from "./Components/NavigationBar/NavigationBar";
import Modal from "./Components/Modals/Modal";
import RegisterModal from "./Components/Modals/RegisterModal";
import ToastProvider from "./Components/Providers/ToastProvider";
import LoginModal from "./Components/Modals/LoginModal";
import getCurrentUser from "./actions/getCurrentUser";
import RentModal from "./Components/Modals/RentModal";
import Home from "./page";
import SearchModal from "./Components/Modals/SearchModal";
import AuthContext from "./context/AuthContext";
import UserSearchModal from "./Components/Modals/UserSearchModal";
import VerificationModal from "./Components/Modals/VerificationModal";
import VerifyLoginModal from "./Components/Modals/VerifyLoginModal";

export const metadata: Metadata = {
  title: "The final project",
  description: "The final project",
};
const nunitoBold = Nunito({ weight: "700", subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  return (
    <html lang="en">
      <body className={nunitoBold.className}>
        <AuthContext>
          <ToastProvider />
          <VerifyLoginModal />
          <VerificationModal />
          <UserSearchModal />
          <RegisterModal />
          <SearchModal />
          <LoginModal />
          <RentModal />
          <NavigationBar currentUser={currentUser} />
          <div className=" pt-[4px] pb-20"></div>
          <div className=" pt-[4px] pb-20"></div>
          <div className=" pt-[4px] pb-20">{children}</div>
        </AuthContext>
      </body>
    </html>
  );
}
