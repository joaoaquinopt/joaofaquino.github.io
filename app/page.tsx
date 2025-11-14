'use client';
import { useEffect, useState } from 'react';

interface Activity {
  date: string;
  distance: number;
  moving_time: number;
  pace: string;
}

export default function HomePage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/strava_summary.json')
      .then((res) => res.json())
      .then((data) => {
        setActivities(data);
      })
      .catch((err) => console.error('Erro ao carregar dados:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col items-center text-center">
      {/* Título principal */}
      <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
        A minha Jornada até à Maratona 2026
      </h1>
      <p className="text-gray-600 mb-8">
        Dados reais de treino — esforço, ritmo e consistência.
      </p>

      {/* Dados ou Placeholder */}
      <section className="w-full max-w-2xl">
        {loading ? (
          <p className="text-gray-500">Carregando dados...</p>
        ) : activities.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow text-center">
            <p className="text-gray-700">
              🏃‍♂️ Nenhum treino disponível ainda.<br />
              Conecta o Strava e volta depois para acompanhar o progresso!
            </p>
          </div>
        ) : (
          activities.map((act, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm p-6 mb-4 border border-gray-100 text-left"
            >
              <h3 className="font-semibold text-lg mb-2">{act.date}</h3>
              <div className="space-y-1 text-gray-700">
                <p>🏃‍♂️ {act.distance} km</p>
                <p>⏱️ {Math.round(act.moving_time / 60)} min</p>
                <p>⚡ Ritmo médio: {act.pace}</p>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
