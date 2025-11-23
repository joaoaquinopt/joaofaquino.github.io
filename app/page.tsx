"use client";

import { useEffect, useMemo, useState } from "react";
import LatestRunCard from "../components/LatestRunCard";
import StatsOverview from "../components/StatsOverview";
import CTASection from "../components/CTASection";
import JourneySection from "../components/JourneySection";
import HeroSection from "../components/HeroSection";

interface NormalizedGarminData {
  stats: {
    total_runs: number;
    total_distance: number;
    total_time: string;
    avg_pace: string;
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

        const latest = data.activities?.[0] ?? null;

        const totalTimeSeconds = Number(data.total_time ?? data.stats?.total_time ?? 0);

        setGarminData({
          stats: {
            total_runs: data.total_runs ?? data.stats?.total_runs ?? 0,
            total_distance: data.total_distance ?? data.stats?.total_distance ?? 0,

            // ANTES: total_time: formatTimeHours(Number(data.total_time ?? data.stats?.total_time ?? 0)),
            // AGORA:
            total_time: formatTotalTimeForStats(
              Number(
                data.total_time ??
                data.stats?.total_time_seconds ??
                data.stats?.total_time ??
                0
              )
            ),

            avg_pace: formatPace(Number(data.avg_pace ?? data.stats?.avg_pace ?? 0)),
          },

          latest_run: latest
            ? {
              date: latest.date,
              distance: latest.distance,

              // <-- continua formatado, aqui está correcto
              time: formatTimeHours(latest.total_time),

              pace: formatPace(latest.average_pace),
              calories: latest.calories,
              avg_hr: latest.average_heartrate,
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
            <LatestRunCard data={latestRunForCard} />
          </div>
        </div>

        <section className="lg:col-span-2" id="journey">
          <JourneySection />
        </section>
      </div>

      <CTASection />
    </div>
  );
}
