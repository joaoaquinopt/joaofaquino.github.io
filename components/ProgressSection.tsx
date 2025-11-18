'use client';
import { useEffect, useState } from 'react';

interface StravaData {
  distance: number;
  pace: string;
  moving_time: number;
  heart_rate: number;
  activities: number;
  week_start: string;
  week_end: string;
}

export default function ProgressSection() {
  const [data, setData] = useState<StravaData | null>(null);

  useEffect(() => {
    fetch('/public/data/strava_summary.json')
      .then((res) => res.json())
      .then(setData)
      .catch(() => console.warn('⚠️ Nenhum dado do Strava.'));
  }, []);

  return (
    <section id="progresso">
      <h2>Progresso</h2>
      <p>Resumo da última semana de treinos, direto do Strava:</p>

      <div className="progress-card">
        <div className="badge-week">Últimos 7 dias</div>

        <h3>Road to Marathon 2026</h3>
        <p className="week-range">
          {data ? `${data.week_start} → ${data.week_end}` : '-- → --'}
        </p>

        <ul className="metrics">
          <li><span className="label">Distância</span> <span className="value">{data ? data.distance.toFixed(1) : 0} km</span></li>
          <li><span className="label">Ritmo médio</span> <span className="value">{data ? data.pace : '--:--'} /km</span></li>
          <li><span className="label">Tempo em movimento</span> <span className="value">{data ? (data.moving_time / 3600).toFixed(1) : 0} h</span></li>
          <li><span className="label">FC média</span> <span className="value">{data ? data.heart_rate : '--'} bpm</span></li>
          <li><span className="label">Nº de treinos</span> <span className="value">{data ? data.activities : 0}</span></li>
        </ul>

        <p className="quote">“Nem sempre perfeito, mas sempre em frente.”</p>
      </div>
    </section>
  );
}
