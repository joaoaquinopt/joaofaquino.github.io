"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Jornada" },
    { href: "/progress", label: "Progresso" },
    { href: "/equipment", label: "Equipamento" },
    { href: "/affiliates", label: "Afiliados" },
    { href: "/gallery", label: "Galeria" },
    { href: "/contact", label: "Contacto" },
  ];

  return (
    <header className="bg-gradient-to-b from-blue-900 to-blue-950 dark:from-blue-900 dark:to-blue-950 light:from-blue-100 light:to-blue-200 border-b border-blue-800/50 py-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-6">
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold text-white dark:text-white light:text-blue-900">João Aquino</h1>
          <p className="text-blue-400 dark:text-blue-400 light:text-blue-600 text-sm">🏃 Road to Marathon 2026</p>
        </div>

        <div className="flex items-center gap-6">
          <nav className="flex gap-6 text-gray-300 dark:text-gray-300 light:text-gray-700 text-sm">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`hover:text-blue-400 transition ${pathname === href ? "text-blue-400 font-semibold" : ""
                  }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
