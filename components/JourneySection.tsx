"use client";

import { Award, Flame, HeartPulse, MoonStar, Target } from "lucide-react";
import Reveal from "./Reveal";
import styles from "./JourneySection.module.css";

const highlights = [
  {
    icon: MoonStar,
    title: "Nova energia",
    description: "A corrida substituiu a insónia e o stress por foco. Dormir voltou a ser opção real.",
  },
  {
    icon: HeartPulse,
    title: "Disciplina imperfeita",
    description: "Falho, recomeço e sigo. Consistência acima da perfeição, todos os dias.",
  },
  {
    icon: Target,
    title: "Meta 2026",
    description: "Cruzar a primeira maratona com o Davi na meta a celebrar o percurso inteiro.",
  },
  {
    icon: Flame,
    title: "Transformação",
    description: "Cada treino queima vícios antigos e acende versões novas de mim mesmo.",
  },
];

const milestones = [
  {
    year: "Jun 2024",
    heading: "Primeiro passo",
    copy: "Treinos começam como remédio para noites em claro e excesso de cigarros.",
  },
  {
    year: "Set 2024",
    heading: "Rotina em construção",
    copy: "Planilha própria, corridas às 7h e primeiras provas de 5 km completadas.",
  },
  {
    year: "Nov 2024",
    heading: "Treinos estruturados",
    copy: "Blocos Z2/Z3, trabalhos de velocidade e data fixada: Maratona 2026.",
  },
  {
    year: "2025",
    heading: "Expansão",
    copy: "Dashboard, dados Garmin e partilha pública para criar responsabilidade.",
  },
];

export default function JourneySection() {
  return (
    <div className={styles.wrapper}>
      <Reveal>
        <div className={styles.heroCard}>
          <div className={styles.heroBadge}>
            <Award className="w-4 h-4" />
            <span>A Jornada</span>
          </div>
          <h1 className={styles.heroTitle}>
            Sou João Aquino, QA Engineer, pai do Davi, ex-fumador em reabilitação e corredor amador rumo à maratona de 2026.
          </h1>
          <p className={styles.heroText}>
            Comecei a correr porque o corpo pediu ajuda: insónia crónica, stress, cigarro e falta de energia. A corrida virou tratamento e promessa. Cada quilómetro é um voto de confiança no futuro que construo.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <div className={styles.highlightsGrid}>
          {highlights.map(({ icon: Icon, title, description }) => (
            <article key={title} className={styles.highlightCard}>
              <div className={styles.highlightContent}>
                <div className={styles.highlightIcon}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={styles.highlightTitle}>{title}</h3>
                  <p className={styles.highlightText}>{description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.25}>
        <div className={styles.timelineCard}>
          <div className={styles.timelineHeader}>
            <Target className="w-5 h-5" />
            <span>Linha do tempo</span>
          </div>
          <div className={styles.timelineList}>
            {milestones.map(({ year, heading, copy }) => (
              <div key={year} className={styles.timelineItem}>
                <span className={styles.timelineDot} />
                <div>
                  <p className={styles.timelineYear}>{year}</p>
                </div>
                <div>
                  <p className={styles.timelineHeading}>{heading}</p>
                  <p className={styles.timelineText}>{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.35}>
        <p className={styles.quote}>
          "Nem sempre perfeito, mas sempre em frente."
        </p>
      </Reveal>
    </div>
  );
}
