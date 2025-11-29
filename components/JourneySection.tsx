"use client";

import { Award, Flame, HeartPulse, MoonStar, Target } from "lucide-react";
import Reveal from "./Reveal";
import styles from "./JourneySection.module.css";
import { useTranslation } from "./TranslationProvider";

export default function JourneySection() {
  const { t } = useTranslation();

  const highlights = [
    {
      icon: MoonStar,
      title: t("journey.highlight.energy.title"),
      description: t("journey.highlight.energy.desc"),
    },
    {
      icon: HeartPulse,
      title: t("journey.highlight.discipline.title"),
      description: t("journey.highlight.discipline.desc"),
    },
    {
      icon: Target,
      title: t("journey.highlight.goal.title"),
      description: t("journey.highlight.goal.desc"),
    },
    {
      icon: Flame,
      title: t("journey.highlight.transform.title"),
      description: t("journey.highlight.transform.desc"),
    },
  ];

  const milestones = [
    {
      year: "Jun 2024",
      heading: t("journey.timeline.2024jun.title"),
      copy: t("journey.timeline.2024jun.text"),
    },
    {
      year: "Set 2024",
      heading: t("journey.timeline.2024sep.title"),
      copy: t("journey.timeline.2024sep.text"),
    },
    {
      year: "Nov 2024",
      heading: t("journey.timeline.2024nov.title"),
      copy: t("journey.timeline.2024nov.text"),
    },
    {
      year: "2025",
      heading: t("journey.timeline.2025.title"),
      copy: t("journey.timeline.2025.text"),
    },
  ];

  return (
    <div className={styles.wrapper}>
      <Reveal>
        <section className={styles.heroCard}>
          <div className={styles.heroBadge}>
            <Award className="w-4 h-4" />
            <span>{t("journey.badge")}</span>
          </div>

          <h2 className={styles.heroTitle}>
            {t("journey.intro")}
          </h2>

          <p className={styles.heroText}>
            {t("journey.text")}
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
            <span>{t("journey.timeline.title")}</span>
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
          &ldquo;{t("common.roadToMarathon")}&rdquo;
        </p>
      </Reveal>
    </div>
  );
}
