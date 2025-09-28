
import { useEffect } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ModalManager from "./components/Modals/ModalManager";
import { ImageZoomModal } from "./components/Modals/ImageZoomModal/ImageZoomModal";
import { ToastContainer } from "react-toastify";
import { useAuthStore } from "./lib/authStore"; // <-- импорт сторы
import AuthProvider from "./lib/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Auction.com",
  description: "Buy masterpiece today",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 
  return (
    <html lang="ru">
      <body>
        <AuthProvider>
        <Header />
        <ToastContainer/>
        <ModalManager />
        <ImageZoomModal />
        <main>{children}</main>
        <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
