"use client";

import {
  Activity,
  Calendar,
  Target,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react";
import Reveal from "./Reveal";
import styles from "./StatsOverview.module.css";

interface StatsOverviewProps {
  stats?: {
    total_runs: number;
    total_distance: number;
    avg_pace: string;
    total_time?: string;
    avg_distance?: number;
    marathon_progress?: number;
  };
  thisWeek?: {
    runs: number;
    distance: number;
  };
}

const WEEKLY_GOAL_KM = 25;
const MARATHON_DISTANCE_KM = 42.195;

const formatTotalTime = (time?: string) => {
  if (!time) return "0h";
  const [hours, minutes] = time.split(":");
  const h = Number(hours || 0);
  const m = Number(minutes || 0);
  return `${h}h ${m}m`;
};

export default function StatsOverview({ stats, thisWeek }: StatsOverviewProps) {
  if (!stats) return null;

  const weeklyRuns = thisWeek?.runs ?? 0;
  const weeklyDistance = thisWeek?.distance ?? 0;

  const marathonProgressRaw =
    stats.marathon_progress ?? (stats.total_distance / MARATHON_DISTANCE_KM) * 100;
  const marathonProgress = Math.min(100, Math.round(marathonProgressRaw));
  const distanceRemaining = Math.max(0, MARATHON_DISTANCE_KM - stats.total_distance);

  const weeklyGoalProgress = Math.min(100, Math.round((weeklyDistance / WEEKLY_GOAL_KM) * 100));
  const weeklyGoalDiff = Math.max(0, WEEKLY_GOAL_KM - weeklyDistance);

  return (
    <div className={styles.wrapper}>
      <Reveal>
        <article className={styles.heroCard}>
          <div className={styles.heroHeader}>
            <div className={styles.heroIcon}>
              <TrendingUp className="w-7 h-7" />
            </div>
            <div className={styles.heroHeaderText}>
              <span>Distância total</span>
              <span>Rumo aos {MARATHON_DISTANCE_KM.toFixed(3)} km</span>
            </div>
          </div>

          <div className={styles.heroValue}>
            <span>{stats.total_distance.toFixed(1)}</span>
            <span>km</span>
          </div>

          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <p>Progresso para a maratona</p>
              <strong>{marathonProgress}%</strong>
            </div>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressBar}
                style={{ width: `${marathonProgress}%` }}
              />
            </div>
          </div>

          <div className={styles.heroFooter}>
            <p>
              Falta{distanceRemaining === 0 ? "" : ` ${distanceRemaining.toFixed(1)} km`}{" "}
              para cruzar a meta. Se o progresso continuar, o objetivo chega antes de 2026.
            </p>
            <p>
              Média por treino: {stats.avg_distance ? stats.avg_distance.toFixed(1) : "-"} km · Pace médio {stats.avg_pace} min/km.
            </p>
          </div>
        </article>
      </Reveal>

      <Reveal delay={0.15}>
        <div className={styles.secondaryGrid}>
          <article className={styles.metricCard}>
            <div className={styles.metricContent}>
              <div className={styles.metricHeader}>
                <div className={styles.metricIcon}>
                  <Calendar className="w-5 h-5" />
                </div>
                <div className={styles.metricTitle}>
                  <span>Esta semana</span>
                  <span>Plano em andamento</span>
                </div>
              </div>
              <div className={styles.metricValue}>{weeklyDistance.toFixed(1)} km</div>
              <div className={styles.metricSub}>{weeklyRuns} corrida{weeklyRuns === 1 ? "" : "s"}</div>
              <div className={styles.weekGoal}>
                <div className={styles.weekGoalTrack}>
                  <div
                    className={styles.weekGoalBar}
                    style={{ width: `${weeklyGoalProgress}%` }}
                  />
                </div>
                <div className={styles.metricFooter}>
                  <span>Meta: {WEEKLY_GOAL_KM} km</span>
                  <span>
                    {weeklyGoalDiff <= 0
                      ? "Meta semanal alcançada"
                      : `Faltam ${weeklyGoalDiff.toFixed(1)} km`}
                  </span>
                </div>
              </div>
            </div>
          </article>

          <article className={styles.metricCard}>
            <div className={styles.metricContent}>
              <div className={styles.metricHeader}>
                <div className={styles.metricIcon}>
                  <Activity className="w-5 h-5" />
                </div>
                <div className={styles.metricTitle}>
                  <span>Corridas totais</span>
                  <span>Volume construído</span>
                </div>
              </div>
              <div className={styles.metricValue}>{stats.total_runs}</div>
              <div className={styles.metricSub}>treinos completos registados</div>
            </div>
          </article>

          <article className={styles.metricCard}>
            <div className={styles.metricContent}>
              <div className={styles.metricHeader}>
                <div className={styles.metricIcon}>
                  <Timer className="w-5 h-5" />
                </div>
                <div className={styles.metricTitle}>
                  <span>Tempo total</span>
                  <span>Horas investidas</span>
                </div>
              </div>
              <div className={styles.metricValue}>{formatTotalTime(stats.total_time)}</div>
              <div className={styles.metricSub}>de treino acumulado até agora</div>
            </div>
          </article>

          <article className={styles.metricCard}>
            <div className={styles.metricContent}>
              <div className={styles.metricHeader}>
                <div className={styles.metricIcon}>
                  <Zap className="w-5 h-5" />
                </div>
                <div className={styles.metricTitle}>
                  <span>Pace médio</span>
                  <span>Ritmo de treino</span>
                </div>
              </div>
              <div className={styles.metricValue}>{stats.avg_pace}</div>
              <div className={styles.metricSub}>min/km, mantendo consistência</div>
            </div>
          </article>
        </div>
      </Reveal>
    </div>
  );
}
