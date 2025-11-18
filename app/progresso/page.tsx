"use client";

import { motion } from "framer-motion";

export default function ProgressoPage() {
  return (
    <motion.section
      className="max-w-4xl mx-auto text-center mt-20 px-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h1 className="text-3xl font-bold text-blue-400 mb-4">Progresso</h1>
      <p className="text-gray-300 mb-6">
        Aqui acompanharás a evolução da minha preparação para a maratona —
        com estatísticas reais vindas do Strava e dashboards personalizados.
      </p>
      <div className="bg-gradient-to-b from-blue-600 to-blue-900 border border-blue-400/40 p-6 rounded-2xl shadow-lg text-gray-100">
        <p className="italic text-gray-400">Dashboard em construção 🚧</p>
      </div>
    </motion.section>
  );
}