"use client";

import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import HeroSection from "../components/HeroSection";
import StatsOverview from "../components/StatsOverview";

// Lazy load componentes abaixo do fold para melhorar a performance inicial
const LatestRunCard = lazy(() => import("../components/LatestRunCard"));
const JourneySection = lazy(() => import("../components/JourneySection"));
const CTASection = lazy(() => import("../components/CTASection"));

// Skeleton loading para componentes lazy
const CardSkeleton = () => (
  <div className="bg-white/5 rounded-2xl p-6 animate-pulse">
    <div className="h-4 bg-white/10 rounded w-1/3 mb-4" />
    <div className="h-8 bg-white/10 rounded w-1/2 mb-2" />
    <div className="h-4 bg-white/10 rounded w-2/3" />
  </div>
);

const SectionSkeleton = () => (
  <div className="bg-white/5 rounded-2xl p-8 animate-pulse space-y-4">
    <div className="h-6 bg-white/10 rounded w-1/4" />
    <div className="h-4 bg-white/10 rounded w-3/4" />
    <div className="h-4 bg-white/10 rounded w-1/2" />
  </div>
);

interface NormalizedGarminData {
  stats: {
    total_runs: number;
    total_distance: number;
    total_time: string;
    avg_pace: string;
    avg_distance?: number;
    marathon_progress?: number;
  };
  this_week?: {
    runs: number;
    distance: number;
    time: string;
  };
  latest_run?: any;
}

export default function HomePage() {
  const [garminData, setGarminData] = useState<NormalizedGarminData | null>(
    null
  );

  const formatTimeHours = (seconds: number) => {
    if (!Number.isFinite(seconds)) return "0h 00m";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const formatPace = (minPerKm: number) => {
    if (!Number.isFinite(minPerKm) || minPerKm <= 0) return "–";
    const minutes = Math.floor(minPerKm);
    const seconds = Math.round((minPerKm - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}/km`;
  };

  // Converte segundos totais em string "HH:MM" para o StatsOverview
  const formatTotalTimeForStats = (seconds: number): string => {
    if (!Number.isFinite(seconds) || seconds <= 0) return "00:00";

    const totalMinutes = Math.floor(seconds / 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;

    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    fetch("/data/garmin_summary.json")
      .then((res) => res.json())
      .then((data) => {
        const statsSource = data.stats ?? {};
        const latest =
          data.latest_run ??
          data.recent_runs?.[0] ??
          data.activities?.[0] ??
          null;

        const rawTotalTime =
          data.total_time_seconds ??
          data.total_time ??
          statsSource.total_time_seconds ??
          statsSource.total_time ??
          0;

        const normalizePace = (value: unknown) => {
          if (typeof value === "string") {
            return value.includes("/") ? value : `${value}/km`;
          }
          return formatPace(Number(value ?? 0));
        };

        const thisWeekRaw = data.this_week ?? statsSource.this_week ?? null;

        setGarminData({
          stats: {
            total_runs: Number(data.total_runs ?? statsSource.total_runs ?? 0),
            total_distance: Number(data.total_distance ?? statsSource.total_distance ?? 0),
            total_time: formatTotalTimeForStats(Number(rawTotalTime ?? 0)),
            avg_pace: normalizePace(data.avg_pace ?? statsSource.avg_pace ?? 0),
            avg_distance: Number(data.avg_distance ?? statsSource.avg_distance ?? 0) || undefined,
            marathon_progress: Number(
              data.marathon_progress ?? statsSource.marathon_progress ?? 0
            ),
          },
          this_week: thisWeekRaw
            ? {
              runs: Number(thisWeekRaw.runs ?? 0),
              distance: Number(thisWeekRaw.distance ?? 0),
              time: typeof thisWeekRaw.time === "string"
                ? thisWeekRaw.time
                : formatTimeHours(Number(thisWeekRaw.time ?? 0)),
            }
            : undefined,
          latest_run: latest
            ? {
              date: latest.date ?? latest.iso_date ?? latest.start_time,
              distance: Number(latest.distance ?? latest.distance_km ?? 0),
              time: formatTimeHours(
                Number(
                  latest.time_seconds ??
                  latest.total_time ??
                  latest.total_time_seconds ??
                  latest.moving_time ??
                  latest.elapsed_time ??
                  0
                )
              ),
              pace: normalizePace(
                latest.pace ??
                latest.avg_pace ??
                latest.average_pace ??
                latest.average_pace_min_per_km ??
                0
              ),
              calories: Number(latest.calories ?? latest.total_calories ?? 0) || undefined,
              avg_hr: Number(
                latest.avg_hr ??
                latest.average_heartrate ??
                latest.average_heart_rate ??
                latest.avg_heart_rate ??
                0
              ) || undefined,
            }
            : null,
        });
      })
      .catch((err) => console.error("Erro ao carregar dados do Garmin:", err));
  }, []);

  // 🔧 Normalizar dados da ÚLTIMA CORRIDA para o LatestRunCard
  const latestRunForCard = useMemo(() => {
    if (!garminData?.latest_run) return null;

    const r: any = garminData.latest_run;

    // Distância (aceita vários nomes)
    const distanceKm =
      Number(r.distance_km ?? r.distance ?? r.total_distance ?? 0) || 0;

    // Tempo em segundos (tenta vários campos que o script possa ter criado)
    const timeSeconds =
      Number(
        r.moving_time_seconds ??
        r.moving_time ??
        r.elapsed_time ??
        r.duration_sec ??
        r.duration ??
        r.total_time_seconds ??
        0
      ) || 0;

    // Pace (string pronto ou valor numérico)
    let paceStr: string | undefined =
      r.pace ??
      r.avg_pace ??
      r.average_pace ??
      r.average_pace_min_per_km ??
      undefined;

    if (!paceStr && timeSeconds > 0 && distanceKm > 0) {
      const minPerKm = (timeSeconds / 60) / distanceKm;
      paceStr = formatPace(minPerKm);
    }

    const calories =
      Number(
        r.calories ??
        r.kcal ??
        r.total_calories ??
        r.totalCalories ??
        0
      ) || 0;

    const startTime =
      r.start_time_local ??
      r.start_time ??
      r.start ??
      r.date ??
      r.activity_date ??
      null;

    // Devolvemos um objeto com TODOS os nomes mais comuns
    return {
      ...r,
      distance_km: distanceKm,
      distance: distanceKm,
      moving_time: timeSeconds,
      elapsed_time: timeSeconds,
      total_time_seconds: timeSeconds,
      avg_pace: paceStr,
      pace: paceStr,
      calories,
      start_time_local: startTime,
      start_time: startTime,
      date: startTime,
    };
  }, [garminData]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 mt-8 md:mt-12 pb-20 space-y-12">
      <HeroSection />

      {garminData && (
        <StatsOverview
          stats={garminData.stats}
          thisWeek={garminData.this_week}
        />
      )}

      <div className="grid lg:grid-cols-3 gap-8" id="runs">
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <Suspense fallback={<CardSkeleton />}>
              <LatestRunCard data={latestRunForCard} />
            </Suspense>
          </div>
        </div>

        <section className="lg:col-span-2" id="journey">
          <Suspense fallback={<SectionSkeleton />}>
            <JourneySection />
          </Suspense>
        </section>
      </div>

      <Suspense fallback={<SectionSkeleton />}>
        <CTASection />
      </Suspense>
    </div>
  );
}
