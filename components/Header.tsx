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
    { href: "/affiliates", label: t("nav.affiliates"), icon: Store },
    { href: "/gallery", label: t("nav.gallery"), icon: Image },
    { href: "/contact", label: t("nav.contact"), icon: Mail },
  ];

  return (
    <header className="bg-header border-b border-blue-800/30 sticky top-0 z-50">
      <div className="mx-auto max-w-[98%] px-4">
        {/* Primeira linha: Logo, Nome centralizado, Language Toggle */}
        <div className="flex h-16 items-center justify-between gap-6">
          {/* Logo - Esquerda */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity shrink-0">
            <img
              src="/logo.jpg"
              alt="Road to Marathon 2026"
              className="h-12 w-12 rounded-lg object-cover"
            />
          </Link>

          {/* Nome centralizado */}
          <div className="absolute left-1/2 -translate-x-1/2 text-center">
            <p className="text-lg font-bold text-white leading-tight whitespace-nowrap">João Aquino</p>
          </div>

          {/* Language Toggle - Direita */}
          <div className="flex items-center gap-3 shrink-0 min-w-fit">
            <LanguageToggle />

            {/* Botão Hamburguer - SÓ MOBILE */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={styles.hamburgerBtn}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Segunda linha: Navigation - Desktop */}
        <nav className={styles.desktopNav}>
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 transition-colors hover:text-blue-400 whitespace-nowrap ${isActive ? "text-blue-400" : "text-gray-300"
                  }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
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
                  className={`${styles.mobileNavLink} ${isActive ? styles.active : ''}`}
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