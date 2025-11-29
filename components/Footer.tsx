"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { useTranslation } from "./TranslationProvider";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-header text-gray-300 py-8 mt-20 border-t border-blue-800/50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 px-6">

        <div className="text-center md:text-left">
          <p className="text-sm">
            © {new Date().getFullYear()} {t("footer.copyright")}
          </p>
          <Link
            href="/privacy"
            className="text-blue-400 hover:text-blue-300 text-sm mt-1 inline-block"
          >
            {t("footer.privacy")}
          </Link>
        </div>

        <div className="flex gap-6 text-blue-400">
          <a
            href="https://instagram.com/joaofaquino"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-blue-300 transition"
          >
            {/* Instagram SVG from simpleicons.org */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-label="Instagram">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.131 4.602.414 3.635 1.381 2.668 2.348 2.385 3.521 2.326 4.798.013 8.332 0 8.741 0 12c0 3.259.013 3.668.072 4.948.059 1.277.342 2.45 1.309 3.417.967.967 2.14 1.25 3.417 1.309C8.332 23.987 8.741 24 12 24c3.259 0 3.668-.013 4.948-.072 1.277-.059 2.45-.342 3.417-1.309.967-.967 1.25-2.14 1.309-3.417.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.059-1.277-.342-2.45-1.309-3.417-.967-.967-2.14-1.25-3.417-1.309C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
          </a>

          <a
            href="https://github.com/joaoaquinopt"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-blue-300 transition"
          >
            {/* GitHub SVG from simpleicons.org */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-label="GitHub">
              <path d="M12 0C5.37 0 5.37 0 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.263.82-.582 0-.288-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.304-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 013.003-.404c1.018.005 2.045.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.803 5.624-5.475 5.921.43.37.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.218.699.825.58C20.565 21.796 24 17.297 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>

          <a
            href="mailto:contacto@joaofaquino.run"
            aria-label="Email"
            className="hover:text-blue-300 transition"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
