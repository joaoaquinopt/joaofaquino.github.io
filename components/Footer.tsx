"use client";

import Link from "next/link";
import Image from "next/image";
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

        <div className="flex gap-5 items-center">
          <a
            href="https://instagram.com/joaofaquino"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:opacity-80 transition"
          >
            <Image
              src="/assets/icons/social/instagram.png"
              alt="Instagram"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </a>

          <a
            href="https://x.com/JoaoMig80710909"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
            className="hover:opacity-80 transition"
          >
            <Image
              src="/assets/icons/social/x.png"
              alt="X"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </a>

          <a
            href="https://threads.net/@joaofaquino"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Threads"
            className="hover:opacity-80 transition"
          >
            <Image
              src="/assets/icons/social/threads.png"
              alt="Threads"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </a>

          <a
            href="https://tiktok.com/@joaofaquino"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="hover:opacity-80 transition"
          >
            <Image
              src="/assets/icons/social/tiktok.png"
              alt="TikTok"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </a>

          <a
            href="https://www.facebook.com/profile.php?id=61584239752987"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:opacity-80 transition"
          >
            <Image
              src="/assets/icons/social/facebook.png"
              alt="Facebook"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </a>

          <a
            href="mailto:contacto@joaofaquino.run"
            aria-label="Email"
            className="hover:text-blue-300 transition text-blue-400"
          >
            <Mail className="w-6 h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
}
