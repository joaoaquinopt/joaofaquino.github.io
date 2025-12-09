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
        // Consolidate data sources
        const statsSource = data.stats ?? {};
        const latest =
          data.latest_run ??
          data.recent_runs?.[0] ??
          data.activities?.[0] ??
          null;

        // Single-pass normalization
        const normalizedData: NormalizedGarminData = {
          stats: {
            total_runs: Number(data.total_runs ?? statsSource.total_runs ?? 0),
            total_distance: Number(data.total_distance ?? statsSource.total_distance ?? 0),
            total_time: formatTotalTimeForStats(
              Number(data.total_time_seconds ?? data.total_time ?? statsSource.total_time_seconds ?? statsSource.total_time ?? 0)
            ),
            avg_pace: (() => {
              const paceValue = data.avg_pace ?? statsSource.avg_pace ?? 0;
              if (typeof paceValue === "string") {
                return paceValue.includes("/") ? paceValue : `${paceValue}/km`;
              }
              return formatPace(Number(paceValue));
            })(),
            avg_distance: Number(data.avg_distance ?? statsSource.avg_distance ?? 0) || undefined,
            marathon_progress: Number(data.marathon_progress ?? statsSource.marathon_progress ?? 0),
          },
          this_week: data.this_week ?? statsSource.this_week
            ? {
              runs: Number((data.this_week ?? statsSource.this_week).runs ?? 0),
              distance: Number((data.this_week ?? statsSource.this_week).distance ?? 0),
              time: typeof (data.this_week ?? statsSource.this_week).time === "string"
                ? (data.this_week ?? statsSource.this_week).time
                : formatTimeHours(Number((data.this_week ?? statsSource.this_week).time ?? 0)),
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
              pace: (() => {
                const paceValue = latest.pace ?? latest.avg_pace ?? latest.average_pace ?? latest.average_pace_min_per_km ?? 0;
                if (typeof paceValue === "string") {
                  return paceValue.includes("/") ? paceValue : `${paceValue}/km`;
                }
                return formatPace(Number(paceValue));
              })(),
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
        };

        setGarminData(normalizedData);
      })
      .catch((err) => console.error("Erro ao carregar dados do Garmin:", err));
  }, []);

  // 🔧 Normalizar dados da ÚLTIMA CORRIDA para o LatestRunCard
  const latestRunForCard = useMemo(() => {
    if (!garminData?.latest_run) return null;

    const r = garminData.latest_run;

    // Data já está normalizada no useEffect
    return {
      ...r,
      // Aliases para compatibilidade
      distance_km: r.distance,
      moving_time: r.time,
      elapsed_time: r.time,
      total_time_seconds: r.time,
      avg_pace: r.pace,
      start_time_local: r.date,
      start_time: r.date,
    };
  }, [garminData?.latest_run]);

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
