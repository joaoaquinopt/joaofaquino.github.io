"use client";

import { memo } from "react";
import {
  Activity,
  Calendar,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react";
import Reveal from "./Reveal";
import styles from "./StatsOverview.module.css";
import { useTranslation } from "./TranslationProvider";

interface StatsOverviewProps {
  stats?: {
    total_runs: number;
    total_distance: number;
    avg_pace: string;
    total_time?: string | number;
    avg_distance?: number;
  };
  thisWeek?: {
    runs: number;
    distance: number;
    time?: string | number;
    goal?: number;
    start_date?: string;
    end_date?: string;
  };
}

const DEFAULT_WEEKLY_GOAL_KM = 25;

function StatsOverview({ stats, thisWeek }: StatsOverviewProps) {
  const { t, language } = useTranslation();

  const formatWeekRange = (start?: string, end?: string) => {
    if (!start || !end) return null;

    const startDate = new Date(`${start}T00:00:00`);
    const endDate = new Date(`${end}T00:00:00`);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return null;
    }

    const formatter = new Intl.DateTimeFormat(language === "pt" ? "pt-PT" : "en-GB", {
      day: "2-digit",
      month: "short",
    });

    return `${formatter.format(startDate)} – ${formatter.format(endDate)}`;
  };

  const formatTotalTime = (time?: string | number) => {
    if (time === undefined || time === null) return "0h 0m";

    // Caso venha string "HH:MM"
    if (typeof time === "string" && time.includes(":")) {
      const parts = time.split(":").map((value) => Number(value || 0));
      const [hours, minutes, seconds] =
        parts.length === 3
          ? [parts[0], parts[1], parts[2]]
          : [parts[0] ?? 0, parts[1] ?? 0, 0];

      const totalMinutes = minutes + Math.floor(seconds / 60);
      return `${hours}h ${totalMinutes}m`;
    }

    // Caso venha número (segundos)
    if (typeof time === "number") {
      const h = Math.floor(time / 3600);
      const m = Math.floor((time % 3600) / 60);
      return `${h}h ${m}m`;
    }

    return "0h 0m";
  };

  if (!stats) return null;

  const weeklyRuns = thisWeek?.runs ?? 0;
  const weeklyDistance = thisWeek?.distance ?? 0;
  const rawGoal = Number(thisWeek?.goal ?? DEFAULT_WEEKLY_GOAL_KM);
  const weeklyGoal = Number.isFinite(rawGoal) && rawGoal > 0 ? rawGoal : DEFAULT_WEEKLY_GOAL_KM;
  const weeklyGoalProgress = weeklyGoal > 0
    ? Math.min(100, Math.round((weeklyDistance / weeklyGoal) * 100))
    : 0;
  const weeklyGoalDiff = Math.max(0, weeklyGoal - weeklyDistance);
  const weeklyRange = formatWeekRange(thisWeek?.start_date, thisWeek?.end_date);
  const weeklyTime = thisWeek?.time ? formatTotalTime(thisWeek.time) : null;

  return (
    <div className={styles.wrapper}>
      <Reveal>
        <article className={styles.heroCard}>
          <div className={styles.heroHeader}>
            <div className={styles.heroIcon}>
              <TrendingUp className="w-7 h-7" />
            </div>
            <div className={styles.heroHeaderText}>
              <span>{t("stats.totalDistance")}</span>
              <span>{t("stats.allKilometers")}</span>
            </div>
          </div>

          <div className={styles.heroValue}>
            <span>{stats.total_distance.toFixed(1)}</span>
            <span>km</span>
          </div>

          <div className={styles.heroFooter}>
            <p>
              {t("stats.accumulated")} {stats.total_runs} {t("stats.training")}{stats.total_runs === 1 ? "" : "s"} {t("stats.registered")}{stats.total_runs === 1 ? "" : "s"}.
            </p>
            <p>
              {t("stats.avgPerTraining")}{" "}
              {stats.avg_distance ? stats.avg_distance.toFixed(1) : "-"} km · {t("stats.avgPace")}{" "}
              {stats.avg_pace} min/km.
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
                  <span>{t("stats.thisWeek")}</span>
                  <span>{t("stats.planInProgress")}</span>
                  {weeklyRange && <span>{weeklyRange}</span>}
                </div>
              </div>
              <div className={styles.metricValue}>
                {weeklyDistance.toFixed(1)} km
              </div>
              <div className={styles.metricSub}>
                {weeklyRuns} {t("stats.run")}{weeklyRuns === 1 ? "" : "s"}
                {weeklyTime ? ` · ${weeklyTime}` : ""}
              </div>
              <div className={styles.weekGoal}>
                <div className={styles.weekGoalTrack}>
                  <div
                    className={styles.weekGoalBar}
                    style={{ width: `${weeklyGoalProgress}%` }}
                  />
                </div>
                <div className={styles.metricFooter}>
                  <span>{t("stats.goal")}: {weeklyGoal.toFixed(0)} km</span>
                  <span>
                    {weeklyGoalDiff <= 0
                      ? t("stats.goalReached")
                      : `${t("stats.remaining")} ${weeklyGoalDiff.toFixed(1)} km`}
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
                  <span>{t("stats.totalRuns")}</span>
                  <span>{t("stats.volumeBuilt")}</span>
                </div>
              </div>
              <div className={styles.metricValue}>{stats.total_runs}</div>
              <div className={styles.metricSub}>{t("stats.completedTrainings")}</div>
            </div>
          </article>

          <article className={styles.metricCard}>
            <div className={styles.metricContent}>
              <div className={styles.metricHeader}>
                <div className={styles.metricIcon}>
                  <Timer className="w-5 h-5" />
                </div>
                <div className={styles.metricTitle}>
                  <span>{t("stats.totalTime")}</span>
                  <span>{t("stats.hoursInvested")}</span>
                </div>
              </div>
              <div className={styles.metricValue}>
                {formatTotalTime(stats.total_time)}
              </div>
              <div className={styles.metricSub}>
                {t("stats.accumulatedTraining")}
              </div>
            </div>
          </article>

          <article className={styles.metricCard}>
            <div className={styles.metricContent}>
              <div className={styles.metricHeader}>
                <div className={styles.metricIcon}>
                  <Zap className="w-5 h-5" />
                </div>
                <div className={styles.metricTitle}>
                  <span>{t("stats.avgPaceTitle")}</span>
                  <span>{t("stats.trainingRhythm")}</span>
                </div>
              </div>
              <div className={styles.metricValue}>{stats.avg_pace}</div>
              <div className={styles.metricSub}>
                {t("stats.minKmConsistency")}
              </div>
            </div>
          </article>
        </div>
      </Reveal>
    </div>
  );
}

export default memo(StatsOverview);
