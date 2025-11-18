"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ThemeProvider } from "../components/ThemeProvider";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <html lang="pt" suppressHydrationWarning>
      <body className="bg-gradient-to-b from-[#1E4D8B] to-[#0A2540] dark:from-[#1E4D8B] dark:to-[#0A2540] light:from-blue-50 light:to-white text-gray-100 dark:text-gray-100 light:text-gray-900 font-sans">
        <ThemeProvider>
          <Header />

          <AnimatePresence mode="wait">
            <motion.main
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="max-w-5xl mx-auto px-6"
            >
              {children}
            </motion.main>
          </AnimatePresence>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
