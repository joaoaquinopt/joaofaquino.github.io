"use client";

import { Calendar, Clock, Flame, Heart, Zap } from "lucide-react";
import Reveal from "./Reveal";
import styles from "./LatestRunCard.module.css";

interface LatestRunCardProps {
  data?: {
    title: string;
    date: string;
    distance: number;
    time: string;
    pace: string;
    avg_hr?: number;
    calories?: number;
  };
}

export default function LatestRunCard({ data }: Readonly<LatestRunCardProps>) {
  if (!data) {
    return (
      <div className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-6 text-center text-gray-400">
        A carregar dados...
      </div>
    );
  }

  return (
    <Reveal delay={0.1}>
      <article className={styles.card}>
        {/* Top row: ribbon + date */}
        <header className={styles.headerRow}>
          <div className={styles.ribbon}>
            <Zap className="w-4 h-4" />
            <span>Última corrida</span>
          </div>

          <div className={styles.dateTag}>
            <Calendar className="w-4 h-4" />
            <span>{data.date}</span>
          </div>
        </header>

        {/* Main content: left (info + distância) / right (mini-métricas) */}
        <div className={styles.mainRow}>
          {/* LEFT */}
          <div className={styles.leftBlock}>
            <h3 className={styles.title}>{data.title}</h3>
            <p className={styles.subtitle}>Treino registado no Garmin</p>

            <div className={styles.distanceWrapper}>
              <span className={styles.distanceValue}>{data.distance.toFixed(2)}</span>
              <span className={styles.distanceUnit}>km</span>
            </div>
          </div>

          {/* RIGHT */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricTile}>
              <div className={styles.metricLabel}>
                <Clock className="w-4 h-4" />
                <span>Tempo</span>
              </div>
              <div className={styles.metricValue}>{data.time}</div>
            </div>

            <div className={styles.metricTile}>
              <div className={styles.metricLabel}>
                <Zap className="w-4 h-4" />
                <span>Pace</span>
              </div>
              <div className={styles.metricValue}>{data.pace}</div>
            </div>

            {data.avg_hr !== undefined && data.avg_hr !== null && (
              <div className={styles.metricTile}>
                <div className={styles.metricLabel}>
                  <Heart className="w-4 h-4" />
                  <span>FC média</span>
                </div>
                <div className={styles.metricValue}>
                  {data.avg_hr}
                  <span className={styles.metricSuffix}>bpm</span>
                </div>
              </div>
            )}

            {data.calories !== undefined && data.calories !== null && (
              <div className={styles.metricTile}>
                <div className={styles.metricLabel}>
                  <Flame className="w-4 h-4" />
                  <span>Calorias</span>
                </div>
                <div className={styles.metricValue}>
                  {data.calories}
                  <span className={styles.metricSuffix}>kcal</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  );
}
