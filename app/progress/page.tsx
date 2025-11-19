"use client";

import { useEffect, useState } from "react";
import PageWrapper from "../../components/PageWrapper";
import HorizontalProgressChart from "../../components/HorizontalProgressChart";
import { Activity, BarChart3, Clock, Zap, Target } from "lucide-react";
import styles from './dashboard.module.css';

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
    totalRuns: 0
  });

  const formatPace = (paceMinPerKm: number) => {
    const minutes = Math.floor(paceMinPerKm);
    const seconds = Math.round((paceMinPerKm - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}/km`;
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
      avgPace: `${avgPaceMin}:${avgPaceSec.toString().padStart(2, '0')}/km`,
      totalRuns: data.length
    });
  };

  useEffect(() => {
    console.log('🔄 Carregando dados do Garmin...');

    // Carregar dados do Garmin exportados
    fetch('/data/garmin_summary.json')
      .then(res => {
        console.log('📡 Response recebida:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('📊 Dados carregados:', data);

        // O ficheiro pode ser um array direto ou um objeto com 'activities'
        const activitiesData = Array.isArray(data) ? data : (data.activities || []);
        console.log('📋 Activities encontradas:', activitiesData.length);

        // Converter formato do Garmin para o formato esperado
        const formattedActivities = activitiesData.map((act: any) => ({
          date: act.date,
          distance: act.distance,
          moving_time: act.total_time || act.moving_time,
          pace: act.pace || formatPace(act.average_pace || 0),
          elevation_gain: act.elevation_gain,
          avg_heart_rate: act.average_heartrate || act.avg_heart_rate,
          max_heart_rate: act.max_heartrate || act.max_heart_rate,
          calories: act.calories
        }));

        console.log('✅ Activities formatadas:', formattedActivities);

        setActivities(formattedActivities);
        calculateStats(formattedActivities);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error loading activities:', err);
        setLoading(false);
      });
  }, []);


  return (
    <PageWrapper>
      <section className="max-w-[1400px] mx-auto mt-8 px-6 min-h-screen pb-20">
        {/* Dashboard Header - v2 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Dashboard de Progresso</h1>
            <p className="text-gray-400 text-sm">Acompanhamento rumo à Maratona 2026</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Última atualização</p>
            <p className="text-white font-semibold">{new Date().toLocaleDateString('pt-PT')}</p>
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
            <p className="text-gray-500 text-sm">Importe os dados CSV do Garmin Connect</p>
          </div>
        )}

        {/* Dashboard Content */}
        {!loading && activities.length > 0 && (
          <div className="space-y-6">
            {/* Row 1: Key Metrics - 4 Cards */}
            <div className={styles.metricsGrid}>
              {/* Metric Card 1 */}
              <div className={styles.metricCardBlue}>
                <div className="flex items-start justify-between mb-3">
                  <div className={styles.iconBlue}>
                    <Activity className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-xs text-green-400 font-semibold">↑ 12%</span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">Total de Corridas</h3>
                <p className="text-3xl font-bold text-white">{stats.totalRuns}</p>
                <p className="text-xs text-gray-500 mt-1">atividades registadas</p>
              </div>

              {/* Metric Card 2 */}
              <div className={styles.metricCardCyan}>
                <div className="flex items-start justify-between mb-3">
                  <div className={styles.iconCyan}>
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-xs text-cyan-400 font-semibold">+{stats.totalRuns} treinos</span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">Distância Total</h3>
                <p className="text-3xl font-bold text-white">{stats.totalDistance} <span className="text-lg text-gray-400">km</span></p>
                <p className="text-xs text-gray-500 mt-1">acumulados em treinos</p>
              </div>

              {/* Metric Card 3 */}
              <div className={styles.metricCardPurple}>
                <div className="flex items-start justify-between mb-3">
                  <div className={styles.iconPurple}>
                    <Clock className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-xs text-purple-400 font-semibold">{(stats.totalTime / 60).toFixed(1)}h</span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">Tempo Acumulado</h3>
                <p className="text-3xl font-bold text-white">{stats.totalTime} <span className="text-lg text-gray-400">min</span></p>
                <p className="text-xs text-gray-500 mt-1">tempo total de treino</p>
              </div>

              {/* Metric Card 4 */}
              <div className={styles.metricCardOrange}>
                <div className="flex items-start justify-between mb-3">
                  <div className={styles.iconOrange}>
                    <Zap className="w-5 h-5 text-orange-400" />
                  </div>
                  <span className="text-xs text-orange-400 font-semibold">médio</span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">Ritmo Médio</h3>
                <p className="text-3xl font-bold text-white">{stats.avgPace}</p>
                <p className="text-xs text-gray-500 mt-1">minutos por km</p>
              </div>
            </div>

            {/* Row 2: Chart + Progress */}
            <div className={styles.chartGrid}>
              {/* Chart - 2/3 width */}
              <div className={styles.chartCard}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1">Distância por Treino</h2>
                    <p className="text-xs text-gray-400">Últimas {activities.length} corridas</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 rounded-2xl bg-purple-500/20 text-purple-400 text-xs font-semibold">Treino</button>
                    <button className="px-3 py-1 rounded-2xl bg-white/5 text-gray-400 text-xs font-semibold hover:bg-white/10">Mês</button>
                  </div>
                </div>
                <HorizontalProgressChart activities={activities} />
              </div>

              {/* Progress Card - 1/3 width */}
              <div className={styles.progressCard}>
                {/* Header com ícone e texto alinhados */}
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-6 h-6 text-white flex-shrink-0" />
                  <h3 className="text-white font-bold text-xl">Meta 2026</h3>
                </div>

                {/* Contador de Dias */}
                <div className="flex-1 flex flex-col items-center justify-center py-8">
                  {(() => {
                    const targetDate = new Date('2026-11-01').getTime();
                    const now = Date.now();
                    const daysRemaining = Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <div className="text-center">
                        <div className="text-7xl font-bold text-white mb-3">
                          {daysRemaining}
                        </div>
                        <p className="text-base text-gray-300 font-medium">dias restantes para a maratona</p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Row 3: Activities List */}
            <div className={styles.card}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">Histórico de Corridas</h2>
                  <p className="text-xs text-gray-400">{activities.length} atividades registadas</p>
                </div>
                <button className="px-4 py-2 rounded-2xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm font-semibold transition-all">
                  Ver todas
                </button>
              </div>

              {/* Activities Grid */}
              <div className={styles.activitiesGrid}>
                {activities.map((activity, index) => {
                  const date = new Date(activity.date);
                  const dayMonth = `${date.getDate()}/${date.getMonth() + 1}`;
                  const runNumber = activities.length - index;

                  // Cores dinâmicas para cada card
                  const colors = [
                    { bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.1))', badge: 'from-blue-500/40 to-blue-600/40', border: 'border-blue-400/30', text: 'text-blue-300' },
                    { bgGradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(126, 34, 206, 0.1))', badge: 'from-purple-500/40 to-purple-600/40', border: 'border-purple-400/30', text: 'text-purple-300' },
                    { bgGradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(22, 163, 74, 0.1))', badge: 'from-green-500/40 to-green-600/40', border: 'border-green-400/30', text: 'text-green-300' },
                    { bgGradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(234, 88, 12, 0.1))', badge: 'from-orange-500/40 to-orange-600/40', border: 'border-orange-400/30', text: 'text-orange-300' },
                  ];
                  const color = colors[index % colors.length];

                  return (
                    <div key={`${activity.date}-${index}`} className={styles.activityCard} style={{ background: color.bgGradient }}>
                      {/* Número centralizado no topo */}
                      <div className="flex justify-center mb-4">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color.badge} flex items-center justify-center shadow-lg`}>
                          <span className={`text-xl font-bold ${color.text}`}>#{runNumber}</span>
                        </div>
                      </div>

                      {/* Header com data e pace */}
                      <div className={styles.activityCardHeader}>
                        <div>
                          <p className="text-xs text-gray-400">Data</p>
                          <p className="text-white font-semibold text-sm">{dayMonth}</p>
                        </div>
                        <div className="px-3 py-1 rounded-2xl bg-green-500/20">
                          <span className="text-xs font-bold text-green-400">{activity.pace}</span>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className={styles.activityCardStats}>
                        <div className={styles.activityCardStat}>
                          <BarChart3 className="w-4 h-4 text-blue-400" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-400">Distância</p>
                            <p className="text-white font-bold">{activity.distance} km</p>
                          </div>
                        </div>

                        <div className={styles.activityCardStat}>
                          <Clock className="w-4 h-4 text-cyan-400" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-400">Tempo</p>
                            <p className="text-white font-bold">
                              {Math.floor(activity.moving_time / 60)}:{(activity.moving_time % 60).toString().padStart(2, '0')}
                            </p>
                          </div>
                        </div>

                        {activity.avg_heart_rate && (
                          <div className={styles.activityCardStat}>
                            <Activity className="w-4 h-4 text-red-400" />
                            <div className="flex-1">
                              <p className="text-xs text-gray-400">FC Média</p>
                              <p className="text-white font-bold">{activity.avg_heart_rate} bpm</p>
                            </div>
                          </div>
                        )}

                        {activity.calories && (
                          <div className={styles.activityCardStat}>
                            <Zap className="w-4 h-4 text-orange-400" />
                            <div className="flex-1">
                              <p className="text-xs text-gray-400">Calorias</p>
                              <p className="text-white font-bold">{activity.calories}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className={styles.activityCardFooter}>
                        <div className="flex-1">
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all"
                              style={{ width: `${Math.min((activity.distance / 10) * 100, 100)}%` }}
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
