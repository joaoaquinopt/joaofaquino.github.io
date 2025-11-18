"use client";

import { useEffect, useState } from "react";
import PageWrapper from "../../components/PageWrapper";
import MotionCard from "../../components/MotionCard";
import ProgressCharts from "../../components/ProgressCharts";

interface StravaActivity {
  date: string;
  distance: number;
  moving_time: number;
  pace: string;
}

export default function ProgressoPage() {
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'atividades' | 'dashboard'>('atividades');
  const [stats, setStats] = useState({
    totalDistance: 0,
    totalTime: 0,
    avgPace: "0:00/km",
    totalRuns: 0
  });

  useEffect(() => {
    fetch('/api/strava')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setActivities(data);
          calculateStats(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading Strava data:', err);
        setLoading(false);
      });
  }, []);

  const calculateStats = (data: StravaActivity[]) => {
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

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <PageWrapper>
      <section className="max-w-6xl mx-auto mt-12 px-4 min-h-screen pb-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-blue-400 mb-4">
            Progresso
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Estatísticas reais vindas do Strava — cada quilómetro conta,
            cada corrida é um passo rumo à maratona de 2026.
          </p>
        </div>

        {/* Statistics Cards */}
        {!loading && activities.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <MotionCard>
              <div className="p-6 text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">
                  {stats.totalRuns}
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">Corridas</div>
              </div>
            </MotionCard>

            <MotionCard delay={0.1}>
              <div className="p-6 text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">
                  {stats.totalDistance}
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">km Total</div>
              </div>
            </MotionCard>

            <MotionCard delay={0.2}>
              <div className="p-6 text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">
                  {stats.totalTime}
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">min Total</div>
              </div>
            </MotionCard>

            <MotionCard delay={0.3}>
              <div className="p-6 text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">
                  {stats.avgPace}
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">Ritmo Médio</div>
              </div>
            </MotionCard>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="flex gap-4 mb-8 border-b border-blue-500/20">
          <button
            onClick={() => setActiveTab('atividades')}
            className={`pb-4 px-6 font-semibold transition-all ${
              activeTab === 'atividades'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            🏃‍♂️ Atividades Recentes
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`pb-4 px-6 font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            📊 Dashboard & Gráficos
          </button>
        </div>

        {/* Tab Content: Atividades */}
        {activeTab === 'atividades' && (
          <>
            <div className="mb-8">
              <p className="text-gray-400">Últimas corridas registadas no Strava</p>
            </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-transparent"></div>
            <p className="text-gray-400 mt-4">Carregando dados...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && activities.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg italic">
              Ainda sem dados disponíveis. Execute o script Python para sincronizar.
            </p>
          </div>
        )}

        {/* Individual Run Cards */}
        {!loading && activities.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {activities.map((activity, index) => (
              <MotionCard key={`${activity.date}-${index}`} delay={index * 0.1}>
                <div className="p-6">
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">
                        📅 {formatDate(activity.date)}
                      </div>
                      <div className="text-xl font-bold text-white">
                        Corrida #{activities.length - index}
                      </div>
                    </div>
                    <div className="bg-blue-500/20 rounded-full px-3 py-1">
                      <span className="text-blue-400 text-sm font-semibold">
                        {activity.pace}
                      </span>
                    </div>
                  </div>

                  {/* Card Stats */}
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-blue-500/20">
                    <div>
                      <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                        Distância
                      </div>
                      <div className="text-2xl font-bold text-blue-400">
                        {activity.distance} km
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                        Tempo
                      </div>
                      <div className="text-2xl font-bold text-blue-400">
                        {formatTime(activity.moving_time)}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="h-2 bg-blue-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((activity.distance / 42.195) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      {((activity.distance / 42.195) * 100).toFixed(1)}% da maratona
                    </div>
                  </div>
                </div>
              </MotionCard>
            ))}
          </div>
        )}
          </>
        )}

        {/* Tab Content: Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="mt-8">
            <ProgressCharts activities={activities} />
          </div>
        )}

        {/* Marathon Goal */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <span className="text-4xl">🎯</span>{" "}
            Meta: Maratona 2026
          </h3>
          <p className="text-blue-100 text-lg mb-2">
            Distância objetivo: <span className="font-bold">42.195 km</span>
          </p>
          <p className="text-blue-200 italic text-sm mt-4">
            "Cada treino é uma pequena vitória no caminho para a grande conquista."
          </p>
        </div>
      </section>
    </PageWrapper>
  );
}
