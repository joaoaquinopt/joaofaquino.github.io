import "./globals.css";
import { ReactNode } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow max-w-4xl mx-auto p-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}