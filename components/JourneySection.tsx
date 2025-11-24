"use client";

import { Award, Flame, HeartPulse, MoonStar, Target } from "lucide-react";
import Reveal from "./Reveal";
import styles from "./JourneySection.module.css";

const highlights = [
  {
    icon: MoonStar,
    title: "Nova energia",
    description:
      "A corrida começou como resposta à insónia e ao stress. Hoje é um dos pilares da rotina.",
  },
  {
    icon: HeartPulse,
    title: "Disciplina imperfeita",
    description:
      "Falho, recomeço e sigo. O foco não é ser perfeito, é aparecer vezes suficientes para mudar.",
  },
  {
    icon: Target,
    title: "Meta 2026",
    description:
      "Cruzar a primeira maratona com o Davi na meta, a lembrar o caminho desde o zero.",
  },
  {
    icon: Flame,
    title: "Transformação real",
    description:
      "Cada quilómetro queimo vícios antigos e construo uma versão mais leve e mais presente de mim.",
  },
];

const milestones = [
  {
    year: "Jun 2024",
    heading: "Primeiro passo",
    copy: "Começo a correr para lidar com noites em claro, cigarro e falta de energia.",
  },
  {
    year: "Set 2024",
    heading: "Rotina em construção",
    copy: "Planilha própria, corridas às 7h e primeiras provas de 5 km completadas.",
  },
  {
    year: "Nov 2024",
    heading: "Treinos estruturados",
    copy: "Blocos em Z2/Z3, velocidade e a decisão: Maratona em 2026.",
  },
  {
    year: "2025",
    heading: "Partilha pública",
    copy: "Dashboard, dados Garmin e a jornada aberta nas redes — para criar responsabilidade.",
  },
];

export default function JourneySection() {
  return (
    <div className={styles.wrapper}>
      <Reveal>
        <section className={styles.heroCard}>
          <div className={styles.heroBadge}>
            <Award className="w-4 h-4" />
            <span>A jornada</span>
          </div>

          <h2 className={styles.heroTitle}>
            Sou João Aquino, QA Engineer, pai do Davi, a tentar ser um ex-fumador e corredor amador
            rumo à maratona de 2026.
          </h2>

          <p className={styles.heroText}>
            Comecei a correr porque o corpo pediu ajuda: insónia crónica, stress, cigarro e falta
            de energia. A corrida virou tratamento e promessa. Cada quilómetro é um voto de
            confiança no futuro que estou a construir.
          </p>
        </section>
      </Reveal>

      <Reveal delay={0.15}>
        <section className={styles.highlightsGrid}>
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
        </section>
      </Reveal>

      <Reveal delay={0.25}>
        <section className={styles.timelineCard}>
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
        </section>
      </Reveal>

      <Reveal delay={0.35}>
        <p className={styles.quote}>
          &ldquo;Nem sempre perfeito, mas sempre em frente.&rdquo;
        </p>
      </Reveal>
    </div>
  );
}
