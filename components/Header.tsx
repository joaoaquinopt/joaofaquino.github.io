"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Jornada" },
    { href: "/progresso", label: "Progresso" },
    { href: "/equipamentos", label: "Equipamentos" },
    { href: "/contacto", label: "Contacto" },
  ];

  return (
    <header className="bg-gradient-to-b from-blue-900 to-blue-950 border-b border-blue-800/50 py-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-6">
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold text-white">João Aquino</h1>
          <p className="text-blue-400 text-sm">🏃 Road to Marathon 2026</p>
        </div>

        <nav className="flex gap-6 text-gray-300 text-sm">
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
      </div>
    </header>
  );
}
