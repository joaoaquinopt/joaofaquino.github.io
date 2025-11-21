"use client";

import { usePathname } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ThemeProvider } from "../components/ThemeProvider";
import { TranslationProvider } from "../components/TranslationProvider";
import "./globals.css";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="description" content="João Aquino - Jornada até à Maratona 2026" />
        <title>João Aquino - Road to Marathon 2026</title>
      </head>
      <body className="bg-gradient-to-b from-[#1E4D8B] to-[#0A2540] text-gray-100 font-sans min-h-screen">
        <ThemeProvider>
          <TranslationProvider>
            <Header />
            
            <main key={pathname} className="w-full pt-10 md:pt-16">
              {children}
            </main>

            <Footer />
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
