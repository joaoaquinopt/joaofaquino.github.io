"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import PageWrapper from "../../components/PageWrapper";
import HorizontalProgressChart from "../../components/HorizontalProgressChart";
import { Activity, BarChart3, Clock, Zap, Target, Calendar } from "lucide-react";
import styles from "./dashboard.module.css";
import { useTranslation } from "../../components/TranslationProvider";

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
  const { t, language } = useTranslation();
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

  // 👇 novo: filtro por mês (formato: "YYYY-MM" ou "all")
  const [selectedMonth, setSelectedMonth] = useState<string>("current");

  // Gerar lista de meses disponíveis
  const availableMonths = useMemo(() => {
    if (activities.length === 0) return [];

    const monthsSet = new Set<string>();
    activities.forEach(act => {
      const date = new Date(act.date);
      if (!isNaN(date.getTime())) {
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthsSet.add(key);
      }
    });

    return Array.from(monthsSet).sort().reverse(); // Mais recente primeiro
  }, [activities]);

  // Mês atual no formato "YYYY-MM" - computed once
  const currentMonthKey = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }, []);

  // Filtrar atividades por mês selecionado - optimized with early returns
  const filteredActivities = useMemo(() => {
    if (activities.length === 0) return [];

    // Se "all" ou modo mês, mostrar tudo
    if (selectedMonth === "all" || chartMode === "month") {
      return activities;
    }

    // Determinar o mês a filtrar
    const targetMonth = selectedMonth === "current" ? currentMonthKey : selectedMonth;

    // Filtrar atividades do mês selecionado
    const monthActivities = activities.filter(act => {
      const date = new Date(act.date);
      if (isNaN(date.getTime())) return false;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return key === targetMonth;
    });

    // Se o mês selecionado tem poucas atividades, adicionar últimas do mês anterior
    if (monthActivities.length < 3) {
      const [year, month] = targetMonth.split('-').map(Number);
      const prevDate = new Date(year, month - 2, 1); // mês anterior
      const prevMonthKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

      const prevMonthActivities = activities
        .filter(act => {
          const date = new Date(act.date);
          if (isNaN(date.getTime())) return false;
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          return key === prevMonthKey;
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Ordenar por data
        .slice(-2); // Últimas 2 do mês anterior (mais recentes)

      return [...prevMonthActivities, ...monthActivities].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }

    return monthActivities;
  }, [activities, selectedMonth, currentMonthKey, chartMode]);

  // Formatar nome do mês para exibição (memoized)
  const formatMonthName = useCallback((monthKey: string) => {
    const [year, month] = monthKey.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString(language === 'pt' ? 'pt-PT' : 'en-GB', { month: 'long', year: 'numeric' });
  }, [language]);

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
      <section className="max-w-7xl mx-auto mt-8 px-6 min-h-screen pb-20">
        {/* Header do dashboard */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              {t("progress.title")}
            </h1>
            <p className="text-gray-400 text-sm">
              {t("progress.subtitle")}
            </p>
          </div>

          <div className="text-right hidden sm:block">
            <p className="text-sm text-gray-400">{t("progress.lastUpdate")}</p>
            <p className="text-white font-semibold">
              {new Date().toLocaleDateString(language === 'pt' ? 'pt-PT' : 'en-GB')}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-transparent"></div>
            <p className="text-gray-400 mt-4">{t("progress.loading")}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && activities.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-400 text-lg mb-2">{t("progress.noData")}</p>
            <p className="text-gray-500 text-sm">
              {t("progress.importData")}
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
                  {t("progress.totalRuns")}
                </h3>
                <p className="text-3xl font-bold text-white">
                  {stats.totalRuns}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {t("progress.activitiesRegistered")}
                </p>
              </div>

              {/* Distância Total */}
              <div className={styles.metricCardCyan}>
                <div className="flex items-start justify-between mb-3">
                  <div className={styles.iconCyan}>
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-xs text-cyan-400 font-semibold">
                    +{stats.totalRuns} {t("progress.training")}s
                  </span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">
                  {t("progress.totalDistance")}
                </h3>
                <p className="text-3xl font-bold text-white">
                  {stats.totalDistance}{" "}
                  <span className="text-lg text-gray-400">km</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {t("progress.accumulatedTraining")}
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
                  {t("progress.totalTime")}
                </h3>
                <p className="text-3xl font-bold text-white">
                  {stats.totalTime}{" "}
                  <span className="text-lg text-gray-400">min</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {t("progress.totalTrainingTime")}
                </p>
              </div>

              {/* Ritmo Médio */}
              <div className={styles.metricCardOrange}>
                <div className="flex items-start justify-between mb-3">
                  <div className={styles.iconOrange}>
                    <Zap className="w-5 h-5 text-orange-400" />
                  </div>
                  <span className="text-xs text-orange-400 font-semibold">
                    avg
                  </span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">
                  {t("progress.avgPace")}
                </h3>
                <p className="text-3xl font-bold text-white">
                  {stats.avgPace}
                </p>
                <p className="text-xs text-gray-500 mt-1">{t("progress.minPerKm")}</p>
              </div>
            </div>

            {/* Row 2: Filtro + Chart + Meta 2026 */}
            {/* Filtro por Mês */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-300 font-medium">{t("progress.filterBy")}</span>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className={styles.monthSelect}
                >
                  <option value="current">{t("progress.currentMonth")}</option>
                  <option value="all">{t("progress.allMonths")}</option>
                  {availableMonths.map((month) => (
                    <option key={month} value={month}>
                      {formatMonthName(month)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.chartGrid}>
              {/* Chart */}
              <div className={styles.chartCard}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1">
                      {chartMode === "run" ? t("progress.distanceByRun") : t("progress.distanceByMonth")}
                    </h2>
                    <p className="text-xs text-gray-400">
                      {chartMode === "run"
                        ? `${filteredActivities.length} ${t("progress.runsIn")}${selectedMonth !== "all" && selectedMonth !== "current" ? ` ${formatMonthName(selectedMonth)}` : ""}`
                        : t("progress.totalDistanceByMonth")}
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
                      {t("progress.training")}
                    </button>
                    <button
                      onClick={() => setChartMode("month")}
                      className={`px-3 py-1 rounded-2xl text-xs font-semibold transition-all ${chartMode === "month"
                        ? "bg-purple-500/20 text-purple-300"
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                        }`}
                    >
                      {t("progress.month")}
                    </button>
                  </div>
                </div>

                <HorizontalProgressChart
                  activities={chartMode === "month" ? activities : filteredActivities}
                  mode={chartMode}
                />
              </div>

              {/* Meta 2026 */}
              <div className={styles.progressCard}>
                <div className="flex w-full flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:justify-start sm:text-left">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 sm:h-14 sm:w-14">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white sm:text-xl">{t("progress.goal.title")}</h3>
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
                          {t("progress.goal.daysRemaining")}
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
                    {t("progress.history.title")}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {selectedMonth === "all"
                      ? `${activities.length} ${t("progress.history.activitiesRegistered")}`
                      : `${filteredActivities.length} ${t("progress.history.activities")}${selectedMonth !== "current" ? ` ${t("progress.chart.in")} ${formatMonthName(selectedMonth)}` : ` ${t("progress.history.thisMonth")}`}`
                    }
                  </p>
                </div>
                {selectedMonth !== "all" && (
                  <button
                    onClick={() => setSelectedMonth("all")}
                    className="px-4 py-2 rounded-2xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm font-semibold transition-all"
                  >
                    {t("progress.history.viewAll")}
                  </button>
                )}
              </div>

              <div className={styles.activitiesGrid}>
                {(selectedMonth === "all" ? activities : filteredActivities).map((activity, index) => {
                  const date = new Date(activity.date);
                  const dayMonth = isNaN(date.getTime())
                    ? activity.date
                    : `${date.getDate()}/${date.getMonth() + 1}`;
                  const runNumber = index + 1; // Numeração sequencial: 1, 2, 3...

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
                          <p className="text-xs text-gray-400">{t("progress.history.date")}</p>
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
                            <p className="text-xs text-gray-400">{t("progress.history.distance")}</p>
                            <p className="text-white font-bold">
                              {activity.distance} km
                            </p>
                          </div>
                        </div>

                        <div className={styles.activityCardStat}>
                          <Clock className="w-4 h-4 text-cyan-400" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-400">{t("progress.history.time")}</p>
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
                                {t("progress.history.avgHr")}
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
                                {t("progress.history.calories")}
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
