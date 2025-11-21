"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageToggle from "./LanguageToggle";
import { useTranslation } from "./TranslationProvider";
import { Home, TrendingUp, Watch, Store, Image, Mail, Menu, X } from "lucide-react";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("nav.journey"), icon: Home },
    { href: "/progress", label: t("nav.progress"), icon: TrendingUp },
    { href: "/equipment", label: t("nav.equipment"), icon: Watch },
    { href: "/gallery", label: t("nav.gallery"), icon: Image },
    { href: "/contact", label: t("nav.contact"), icon: Mail },
  ];

  return (
    // 1) header NÃO colado ao topo, e centro o conteúdo
    <header className="sticky top-0 z-50 flex justify-center pointer-events-none mb-12 md:mb-20">
      {/* 2) largura controlada -> tipo card, não faixa */}
      <div className="w-full max-w-5xl px-4 pointer-events-auto">
        {/* 3) o verdadeiro "card" do header */}
        <div
          className="
            bg-slate-950/90
            rounded-[2rem]
            px-6 md:px-10
            py-2 md:py-4
            shadow-[0_12px_40px_rgba(15,23,42,0.85)]
            backdrop-blur-xl
            transition-all
          "
        >
          {/* Primeira linha: logo, nome, toggle */}
          <div className="flex h-16 items-center gap-6 md:gap-8 px-8 md:px-16">
            {/* Logo */}
            <div className="flex items-center justify-center" style={{ minWidth: '72px' }}>
              <Link
                href="/"
                className="flex items-center hover:opacity-80 transition-opacity shrink-0"
              >
                <img
                  src="/assets/brand/logo-rtm2026.svg"
                  alt="Road to Marathon 2026"
                  className="h-12 w-12 object-contain drop-shadow-md"
                />
              </Link>
            </div>

            {/* Nome centralizado */}
            <div className="flex-1 flex justify-center items-center">
              <p className="text-2xl md:text-4xl font-semibold md:font-bold text-white leading-tight whitespace-nowrap text-center tracking-tight">
                João Aquino
              </p>
            </div>

            {/* Toggle + hamburguer */}
            <div className="flex items-center justify-center gap-3" style={{ minWidth: '72px' }}>
              <LanguageToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={styles.hamburgerBtn}
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Segunda linha: navegação desktop (usa o teu .desktopNav) */}
          <nav className={styles.desktopNav}>
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 transition-colors hover:text-blue-300 whitespace-nowrap ${isActive ? "text-blue-200" : "text-gray-200/90"
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Menu Mobile Overlay */}
      {mobileMenuOpen && (
        <div className={styles.mobileOverlay}>
          <nav className={styles.mobileNav}>
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`${styles.mobileNavLink} ${isActive ? styles.active : ""}`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}