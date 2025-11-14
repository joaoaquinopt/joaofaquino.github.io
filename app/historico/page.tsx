'use client';
import { useEffect, useState } from 'react';

interface Activity {
  date: string;
  distance: number;
  moving_time: number;
  pace: string;
}

export default function HistoricoPage() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetch('/data/strava_summary.json')
      .then((res) => res.json())
      .then(setActivities)
      .catch((err) => console.error('Erro ao carregar histórico:', err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Histórico de Treinos</h1>
      {activities.length === 0 ? (
        <p className="text-gray-600">Ainda não há atividades registadas.</p>
      ) : (
        <div className="space-y-4">
          {activities.map((a, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="font-medium">{a.date}</p>
              <p className="text-gray-700">🏃‍♂️ {a.distance} km — ⏱️ {Math.round(a.moving_time / 60)} min — ⚡ {a.pace}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
