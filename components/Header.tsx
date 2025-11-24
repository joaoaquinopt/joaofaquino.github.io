"use client";

import { useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { Flag, BarChart2, Package, Image as ImageIcon, Mail, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import LanguageToggle from "./LanguageToggle";
import { useTranslation } from "./TranslationProvider";
import styles from "./Header.module.css";

export default function Header() {
  // Links de navegação do header
  const navLinks: { href: string; labelKey: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { href: '/', labelKey: 'nav.journey', icon: Flag },
    { href: '/progress', labelKey: 'nav.progress', icon: BarChart2 },
    { href: '/equipment', labelKey: 'nav.equipment', icon: Package },
    { href: '/gallery', labelKey: 'nav.gallery', icon: ImageIcon },
    { href: '/contact', labelKey: 'nav.contact', icon: Mail },
  ];
  const pathname = usePathname();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex justify-center pointer-events-none mb-12 md:mb-20">
      <div className="w-full max-w-5xl px-4 pointer-events-auto">
        <div className={`${styles.header} rounded-[2rem] px-6 md:px-10 py-3 md:py-5 backdrop-blur-xl transition-all flex items-center`} style={{ minHeight: '120px', height: '120px' }}>
          <div className="flex items-center w-full h-full px-4 md:px-8">
            {/* Logo */}
            <div className="flex items-center" style={{ minWidth: '144px' }}>
              <Link
                href="/"
                className="flex items-center hover:opacity-80 transition-opacity shrink-0"
              >
                <NextImage
                  src="/assets/brand/logo-rtm2026.svg"
                  alt="Road to Marathon 2026"
                  width={144}
                  height={144}
                  className="drop-shadow-md"
                  priority
                />
              </Link>
            </div>
            {/* Nome centralizado */}
            <div className="flex-1 flex items-center justify-center">
              <p className="text-4xl md:text-5xl font-extrabold text-white leading-tight whitespace-nowrap tracking-tight truncate" style={{ color: '#fff' }}>
                João Aquino
              </p>
            </div>
            {/* Menus + Toggle alinhados à direita */}
            <div className="flex items-center justify-end gap-4">
              <nav className={`${styles.desktopNav} ${styles.menuGap}`} aria-label="Navegação principal">
                {navLinks.map(({ href, labelKey, icon: Icon }) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-1.5 transition-colors whitespace-nowrap text-white hover:text-blue-300 ${isActive ? styles.active : ""}`}
                      style={{ color: isActive ? '#58A6FF' : '#fff' }}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{t(labelKey)}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="flex items-center gap-3 min-w-fit">
                <LanguageToggle />
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={styles.hamburgerBtn}
                  aria-label="Menu"
                  aria-expanded={mobileMenuOpen}
                >
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
          {/* Navegação desktop */}
        </div>
      </div>
      {/* Menu Mobile Overlay */}
      {mobileMenuOpen && (
        <div className={styles.mobileOverlay}>
          <nav className={styles.mobileNav}>
            {navLinks.map(({ href, labelKey, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`${styles.mobileNavLink} ${isActive ? styles.active : ""}`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{t(labelKey)}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}