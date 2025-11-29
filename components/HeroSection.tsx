"use client";

import Link from "next/link";
import styles from "./HeroSection.module.css";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "./TranslationProvider";

export default function HeroSection() {
    const { t } = useTranslation();
    
    return (
        <section className={`flex justify-center px-4 mb-10 md:mb-16 ${styles.heroSpacing}`}>
            <div className={styles.heroWrapper}>
                {/* Efeito de luz/gradiente no fundo */}
                <div className={styles.heroGradient}>
                    {/* Pode migrar gradientes para cá se quiser customizar mais */}
                </div>

                {/* Conteúdo */}
                <div className="relative">
                    {/* Label pequena */}
                    <p className={styles.heroLabel}>
                        {t("hero.label")}
                    </p>

                    {/* Título principal */}
                    <h1 className={styles.heroTitle}>
                        {t("hero.title")}
                    </h1>

                    {/* Subtexto */}
                    <p className={styles.heroSubtitle}>
                        {t("hero.subtitle")}
                    </p>

                    {/* CTAs */}
                    <div className={styles.heroCtas}>
                        <Link href="#journey" className="inline-flex items-center gap-2 rounded-full bg-sky-500/90 hover:bg-sky-400 text-slate-950 text-xs md:text-sm font-semibold px-4 py-2 transition-colors">
                            {t("hero.cta.journey")}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link href="#runs" className="inline-flex items-center gap-2 rounded-full border border-sky-400/60 text-sky-100 text-xs md:text-sm px-4 py-2 hover:bg-sky-500/10 transition-colors">
                            {t("hero.cta.runs")}
                        </Link>
                    </div>

                    {/* Meta final */}
                    <p className={styles.heroMeta}>
                        <span className="font-medium">{t("hero.meta")}</span>{" "}
                        {t("hero.marathon")}
                    </p>
                </div>
            </div>
        </section>
    );
}
