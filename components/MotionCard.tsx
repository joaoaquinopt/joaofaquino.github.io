"use client";

import { motion } from "framer-motion";

export default function MotionCard({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{
        y: -4,
        scale: 1.03,
        boxShadow: "0 8px 25px rgba(88, 166, 255, 0.25)",
      }}
      whileTap={{
        scale: 0.98,
        boxShadow: "0 2px 8px rgba(88, 166, 255, 0.2)",
      }}
      className="bg-blue-900/40 border border-blue-700/60 rounded-2xl p-6 w-64 text-center cursor-pointer transition-transform"
    >
      {children}
    </motion.div>
  );
}
