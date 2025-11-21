"use client";

import Link from "next/link";
import styles from "./HeroSection.module.css";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
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
                        Road to Marathon 2026
                    </p>

                    {/* Título principal */}
                    <h1 className={styles.heroTitle}>
                        Um pai, um ex-fumador, a caminho da primeira maratona em 2026.
                    </h1>

                    {/* Subtexto */}
                    <p className={styles.heroSubtitle}>
                        Estou a documentar a jornada real até à minha primeira maratona —
                        treinos, insónias, falhas e vitórias. Tudo registado em dados, vídeos
                        e histórias que qualquer pessoa ocupada consegue reconhecer.
                    </p>

                    {/* CTAs */}
                    <div className={styles.heroCtas}>
                        <Link href="#journey" className="inline-flex items-center gap-2 rounded-full bg-sky-500/90 hover:bg-sky-400 text-slate-950 text-xs md:text-sm font-semibold px-4 py-2 transition-colors">
                            Ver jornada
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link href="#runs" className="inline-flex items-center gap-2 rounded-full border border-sky-400/60 text-sky-100 text-xs md:text-sm px-4 py-2 hover:bg-sky-500/10 transition-colors">
                            Ver últimas corridas
                        </Link>
                    </div>

                    {/* Meta final */}
                    <p className={styles.heroMeta}>
                        <span className="font-medium">Próxima grande meta:</span>{" "}
                        Maratona • Novembro 2026
                    </p>
                </div>
            </div>
        </section>
    );
}
