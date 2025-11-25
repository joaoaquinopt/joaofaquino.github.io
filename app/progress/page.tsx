"use client";

import { useEffect, useState } from "react";
import PageWrapper from "../../components/PageWrapper";
import HorizontalProgressChart from "../../components/HorizontalProgressChart";
import { Activity, BarChart3, Clock, Zap, Target } from "lucide-react";
import styles from "./dashboard.module.css";

interface ActivityData {
  date: string;
  distance: number;
  moving_time: number;
  pace: string;
  elevation_gain?: number;
  avg_heart_rate?: number;
  max_heart_rate?: number;
  calories?: number;
}

export default function ProgressoPage() {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDistance: 0,
    totalTime: 0,
    avgPace: "0:00/km",
    totalRuns: 0,
  });

  // 👇 novo: modo do gráfico (Treino / Mês)
  const [chartMode, setChartMode] = useState<"run" | "month">("run");

  const formatPace = (paceMinPerKm: number) => {
    if (!paceMinPerKm || !Number.isFinite(paceMinPerKm)) return "0:00/km";
    const minutes = Math.floor(paceMinPerKm);
    const seconds = Math.round((paceMinPerKm - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}/km`;
  };

  const calculateStats = (data: ActivityData[]) => {
    if (data.length === 0) return;

    const totalDistance = data.reduce((sum, act) => sum + act.distance, 0);
    const totalTime = data.reduce((sum, act) => sum + act.moving_time, 0);
    const avgPaceSeconds = totalTime / totalDistance;
    const avgPaceMin = Math.floor(avgPaceSeconds / 60);
    const avgPaceSec = Math.floor(avgPaceSeconds % 60);

    setStats({
      totalDistance: Math.round(totalDistance * 100) / 100,
      totalTime: Math.round(totalTime / 60),
      avgPace: `${avgPaceMin}:${avgPaceSec.toString().padStart(2, "0")}/km`,
      totalRuns: data.length,
    });
  };

  const parseTimeStringToSeconds = (value?: string) => {
    if (!value || typeof value !== "string") return 0;
    const parts = value.split(":").map(Number);
    if (parts.length === 3) {
      const [hours, minutes, seconds] = parts;
      return hours * 3600 + minutes * 60 + seconds;
    }
    if (parts.length === 2) {
      const [minutes, seconds] = parts;
      return minutes * 60 + seconds;
    }
    return Number(value) || 0;
  };

  useEffect(() => {
    console.log("🔄 Carregando dados do Garmin...");

    fetch("/data/garmin_summary.json")
      .then((res) => {
        console.log("📡 Response recebida:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("📊 Dados carregados:", data);

        const activitiesData = Array.isArray(data)
          ? data
          : data.activities || data.recent_runs || [];
        console.log("📋 Activities encontradas:", activitiesData.length);

        const formattedActivities = activitiesData.map((act: any) => {
          const distance = Number(act.distance ?? act.distance_km ?? 0);
          const seconds = Number(
            act.time_seconds ??
            act.total_time_seconds ??
            act.moving_time ??
            act.total_time ?? // 👈 NOVO: usa o total_time em segundos
            (typeof act.total_time === "string"
              ? parseTimeStringToSeconds(act.total_time)
              : 0)
          );

          const parsedPace = (() => {
            if (act.pace && typeof act.pace === "string") {
              return act.pace.includes("/") ? act.pace : `${act.pace}/km`;
            }
            if (act.avg_pace && typeof act.avg_pace === "string") {
              return act.avg_pace.includes("/") ? act.avg_pace : `${act.avg_pace}/km`;
            }
            if (act.average_pace) {
              return formatPace(Number(act.average_pace));
            }
            return "0:00/km";
          })();

          const avgHr =
            act.avg_heart_rate ??
            act.average_heartrate ??
            act.avg_hr ??
            act.avg_hr_value;
          const maxHr =
            act.max_heart_rate ?? act.max_heartrate ?? act.max_hr;

          return {
            date: act.date || act.iso_date,
            distance,
            moving_time: seconds,
            pace: parsedPace,
            elevation_gain: act.elevation_gain,
            avg_heart_rate: avgHr ? Number(avgHr) : undefined,
            max_heart_rate: maxHr ? Number(maxHr) : undefined,
            calories: act.calories ? Number(act.calories) : undefined,
          } as ActivityData;
        });

        console.log("✅ Activities formatadas:", formattedActivities);

        setActivities(formattedActivities);

        if (data.stats) {
          const totalDistance = Number(data.stats.total_distance ?? 0);
          const totalRuns = Number(
            data.stats.total_runs ?? formattedActivities.length
          );

          const totalTimeMinutes = (() => {
            if (data.stats.total_time_seconds) {
              return Math.round(Number(data.stats.total_time_seconds) / 60);
            }
            if (
              data.stats.total_time &&
              typeof data.stats.total_time === "string"
            ) {
              return Math.round(
                parseTimeStringToSeconds(data.stats.total_time) / 60
              );
            }
            return 0;
          })();

          const avgPaceRaw = data.stats.avg_pace ?? data.stats.average_pace;
          const avgPace =
            typeof avgPaceRaw === "string"
              ? avgPaceRaw.includes("/")
                ? avgPaceRaw
                : `${avgPaceRaw}/km`
              : formatPace(Number(avgPaceRaw));

          setStats({
            totalDistance: Math.round(totalDistance * 100) / 100,
            totalTime: totalTimeMinutes,
            avgPace,
            totalRuns,
          });
        } else {
          calculateStats(formattedActivities);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error loading activities:", err);
        setLoading(false);
      });
  }, []);

  return (
    <PageWrapper>
      <section className="max-w-[1400px] mx-auto mt-8 px-6 min-h-screen pb-20">
        {/* Header do dashboard */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              Dashboard de Progresso
            </h1>
            <p className="text-gray-400 text-sm">
              Acompanhamento rumo à Maratona 2026
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Última atualização</p>
            <p className="text-white font-semibold">
              {new Date().toLocaleDateString("pt-PT")}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-transparent"></div>
            <p className="text-gray-400 mt-4">Carregando dashboard...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && activities.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-400 text-lg mb-2">Dashboard sem dados</p>
            <p className="text-gray-500 text-sm">
              Importe os dados CSV do Garmin Connect
            </p>
          </div>
        )}

        {/* Dashboard Content */}
        {!loading && activities.length > 0 && (
          <div className="space-y-6">
            {/* Row 1: Key Metrics */}
            <div className={styles.metricsGrid}>
              {/* Total de Corridas */}
              <div className={styles.metricCardBlue}>
                <div className="flex items-start justify-between mb-3">
                  <div className={styles.iconBlue}>
                    <Activity className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-xs text-green-400 font-semibold">
                    ↑ 12%
                  </span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">
                  Total de Corridas
                </h3>
                <p className="text-3xl font-bold text-white">
                  {stats.totalRuns}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  atividades registadas
                </p>
              </div>

              {/* Distância Total */}
              <div className={styles.metricCardCyan}>
                <div className="flex items-start justify-between mb-3">
                  <div className={styles.iconCyan}>
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-xs text-cyan-400 font-semibold">
                    +{stats.totalRuns} treinos
                  </span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">
                  Distância Total
                </h3>
                <p className="text-3xl font-bold text-white">
                  {stats.totalDistance}{" "}
                  <span className="text-lg text-gray-400">km</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  acumulados em treinos
                </p>
              </div>

              {/* Tempo Acumulado */}
              <div className={styles.metricCardPurple}>
                <div className="flex items-start justify-between mb-3">
                  <div className={styles.iconPurple}>
                    <Clock className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-xs text-purple-400 font-semibold">
                    {(stats.totalTime / 60).toFixed(1)}h
                  </span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">
                  Tempo Acumulado
                </h3>
                <p className="text-3xl font-bold text-white">
                  {stats.totalTime}{" "}
                  <span className="text-lg text-gray-400">min</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  tempo total de treino
                </p>
              </div>

              {/* Ritmo Médio */}
              <div className={styles.metricCardOrange}>
                <div className="flex items-start justify-between mb-3">
                  <div className={styles.iconOrange}>
                    <Zap className="w-5 h-5 text-orange-400" />
                  </div>
                  <span className="text-xs text-orange-400 font-semibold">
                    médio
                  </span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">
                  Ritmo Médio
                </h3>
                <p className="text-3xl font-bold text-white">
                  {stats.avgPace}
                </p>
                <p className="text-xs text-gray-500 mt-1">minutos por km</p>
              </div>
            </div>

            {/* Row 2: Chart + Meta 2026 */}
            <div className={styles.chartGrid}>
              {/* Chart */}
              <div className={styles.chartCard}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1">
                      Distância {chartMode === "run" ? "por Treino" : "por Mês"}
                    </h2>
                    <p className="text-xs text-gray-400">
                      {chartMode === "run"
                        ? `Últimas ${activities.length} corridas`
                        : "Distância total por mês"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setChartMode("run")}
                      className={`px-3 py-1 rounded-2xl text-xs font-semibold transition-all ${chartMode === "run"
                        ? "bg-purple-500/20 text-purple-300"
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                        }`}
                    >
                      Treino
                    </button>
                    <button
                      onClick={() => setChartMode("month")}
                      className={`px-3 py-1 rounded-2xl text-xs font-semibold transition-all ${chartMode === "month"
                        ? "bg-purple-500/20 text-purple-300"
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                        }`}
                    >
                      Mês
                    </button>
                  </div>
                </div>

                <HorizontalProgressChart
                  activities={activities}
                  mode={chartMode}
                />
              </div>

              {/* Meta 2026 */}
              <div className={styles.progressCard}>
                <div className="flex w-full flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:justify-start sm:text-left">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 sm:h-14 sm:w-14">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white sm:text-xl">Meta 2026</h3>
                </div>

                <div className="flex w-full flex-1 flex-col items-center justify-center py-6 sm:py-8">
                  {(() => {
                    const targetDate = new Date("2026-11-01").getTime();
                    const now = new Date().getTime();
                    const daysRemaining = Math.ceil(
                      (targetDate - now) / (1000 * 60 * 60 * 24)
                    );

                    return (
                      <div className="flex w-full flex-col items-center gap-2 text-center">
                        <div className="text-5xl font-extrabold text-white tracking-tight sm:text-6xl lg:text-7xl">
                          {daysRemaining}
                        </div>
                        <p className="text-sm font-medium text-gray-300 sm:text-base">
                          dias restantes para a maratona
                        </p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Row 3: Histórico de Corridas */}
            <div className={styles.card}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">
                    Histórico de Corridas
                  </h2>
                  <p className="text-xs text-gray-400">
                    {activities.length} atividades registadas
                  </p>
                </div>
                <button className="px-4 py-2 rounded-2xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm font-semibold transition-all">
                  Ver todas
                </button>
              </div>

              <div className={styles.activitiesGrid}>
                {activities.map((activity, index) => {
                  const date = new Date(activity.date);
                  const dayMonth = isNaN(date.getTime())
                    ? activity.date
                    : `${date.getDate()}/${date.getMonth() + 1}`;
                  const runNumber = activities.length - index;

                  const colors = [
                    {
                      bgGradient:
                        "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.1))",
                      badge: "from-blue-500/40 to-blue-600/40",
                      text: "text-blue-300",
                    },
                    {
                      bgGradient:
                        "linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(126, 34, 206, 0.1))",
                      badge: "from-purple-500/40 to-purple-600/40",
                      text: "text-purple-300",
                    },
                    {
                      bgGradient:
                        "linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(22, 163, 74, 0.1))",
                      badge: "from-green-500/40 to-green-600/40",
                      text: "text-green-300",
                    },
                    {
                      bgGradient:
                        "linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(234, 88, 12, 0.1))",
                      badge: "from-orange-500/40 to-orange-600/40",
                      text: "text-orange-300",
                    },
                  ];
                  const color = colors[index % colors.length];

                  return (
                    <div
                      key={`${activity.date}-${index}`}
                      className={styles.activityCard}
                      style={{ background: color.bgGradient }}
                    >
                      <div className="flex justify-center mb-4">
                        <div
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color.badge} flex items-center justify-center shadow-lg`}
                        >
                          <span
                            className={`text-xl font-bold ${color.text}`}
                          >
                            #{runNumber}
                          </span>
                        </div>
                      </div>

                      <div className={styles.activityCardHeader}>
                        <div>
                          <p className="text-xs text-gray-400">Data</p>
                          <p className="text-white font-semibold text-sm">
                            {dayMonth}
                          </p>
                        </div>
                        <div className="px-3 py-1 rounded-2xl bg-green-500/20">
                          <span className="text-xs font-bold text-green-400">
                            {activity.pace}
                          </span>
                        </div>
                      </div>

                      <div className={styles.activityCardStats}>
                        <div className={styles.activityCardStat}>
                          <BarChart3 className="w-4 h-4 text-blue-400" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-400">Distância</p>
                            <p className="text-white font-bold">
                              {activity.distance} km
                            </p>
                          </div>
                        </div>

                        <div className={styles.activityCardStat}>
                          <Clock className="w-4 h-4 text-cyan-400" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-400">Tempo</p>
                            <p className="text-white font-bold">
                              {Math.floor(activity.moving_time / 60)}:
                              {(activity.moving_time % 60)
                                .toString()
                                .padStart(2, "0")}
                            </p>
                          </div>
                        </div>

                        {activity.avg_heart_rate && (
                          <div className={styles.activityCardStat}>
                            <Activity className="w-4 h-4 text-red-400" />
                            <div className="flex-1">
                              <p className="text-xs text-gray-400">
                                FC Média
                              </p>
                              <p className="text-white font-bold">
                                {activity.avg_heart_rate} bpm
                              </p>
                            </div>
                          </div>
                        )}

                        {activity.calories && (
                          <div className={styles.activityCardStat}>
                            <Zap className="w-4 h-4 text-orange-400" />
                            <div className="flex-1">
                              <p className="text-xs text-gray-400">
                                Calorias
                              </p>
                              <p className="text-white font-bold">
                                {activity.calories}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className={styles.activityCardFooter}>
                        <div className="flex-1">
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all"
                              style={{
                                width: `${Math.min(
                                  (activity.distance / 10) * 100,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 ml-3">
                          {((activity.distance / 42.195) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>
    </PageWrapper>
  );
}
