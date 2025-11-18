"use client";

import { motion } from "framer-motion";

export default function ContactoPage() {
  return (
    <motion.section
      className="max-w-4xl mx-auto text-center mt-20 px-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h1 className="text-3xl font-bold text-blue-400 mb-4">Contacto</h1>
      <p className="text-gray-300 mb-6">
        Se quiseres trocar ideias sobre treinos, tecnologia ou colaborações,
        entra em contacto comigo:
      </p>

      <a
        href="mailto:joaofaquino@gmail.com"
        className="text-blue-400 hover:text-blue-300 font-semibold transition"
      >
        joaofaquino@gmail.com
      </a>

      <p className="text-gray-500 mt-6 italic">
        “A corrida é solitária, mas o caminho é partilhado.”
      </p>
    </motion.section>
  );
}