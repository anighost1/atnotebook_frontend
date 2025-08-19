import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SideAndHeader from "@/components/sideAndHeader";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AT Notebook",
  description: "A realtime collaborative notebook app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense>
          <SideAndHeader>
            {children}
          </SideAndHeader>
        </Suspense>
      </body>
    </html>
  );
}
