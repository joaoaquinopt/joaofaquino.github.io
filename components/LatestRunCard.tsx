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

export default function LatestRunCard({ data }: LatestRunCardProps) {
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
        <div className={styles.ribbon}>
          <Zap className="w-4 h-4" />
          Última corrida
        </div>

        <div className={styles.headerTitle}>
          <h3>{data.title}</h3>
          <span>Treino registado no Garmin</span>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.distanceCard}>
            <span className={styles.distanceLabel}>Distância</span>
            <div className={styles.distanceValue}>
              <span>{data.distance.toFixed(2)}</span>
              <span>km</span>
            </div>
          </div>

          <div className={styles.metricsRow}>
            <div className={styles.metricTile}>
              <div className={styles.metricLabel}>
                <Clock className="w-4 h-4" /> Tempo
              </div>
              <div className={styles.metricValue}>{data.time}</div>
            </div>

            <div className={styles.metricTile}>
              <div className={styles.metricLabel}>
                <Zap className="w-4 h-4" /> Pace
              </div>
              <div className={styles.metricValue}>{data.pace}</div>
            </div>

            {data.avg_hr && (
              <div className={styles.metricTile}>
                <div className={styles.metricLabel}>
                  <Heart className="w-4 h-4" /> FC Média
                </div>
                <div className={styles.metricValue}>
                  {data.avg_hr}
                  <span className={styles.metricSuffix}>bpm</span>
                </div>
              </div>
            )}

            {data.calories && (
              <div className={styles.metricTile}>
                <div className={styles.metricLabel}>
                  <Flame className="w-4 h-4" /> Calorias
                </div>
                <div className={styles.metricValue}>
                  {data.calories}
                  <span className={styles.metricSuffix}>kcal</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <Calendar className="w-4 h-4" />
          <span>{data.date}</span>
        </div>
      </article>
    </Reveal>
  );
}
