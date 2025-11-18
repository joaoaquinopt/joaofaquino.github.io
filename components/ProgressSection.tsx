"use client";

import { useEffect, useState } from "react";

interface StravaSummary {
  distance: number;
  moving_time: number;
  pace: string;
  heart_rate: number;
  activities: number;
  week_start: string;
  week_end: string;
}

export default function ProgressSection() {
  const [data, setData] = useState<StravaSummary | null>(null);

  useEffect(() => {
    fetch("public/data/strava_summary.json")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => setData(null));
  }, []);

  return (
    <section id="progresso" className="mt-20 text-center">
      <h2 className="text-3xl font-bold mb-4 text-[var(--color-accent)]">
        Progresso
      </h2>
      <p className="text-gray-300 mb-10">
        Resumo da última semana de treinos, direto do Strava:
      </p>

      <div className="flex justify-center px-2 sm:px-0">
        <div className="progress-card relative text-left max-w-md w-full p-6 sm:p-8 rounded-2xl shadow-lg border border-[rgba(88,166,255,0.4)]">
          {/* Badge superior */}
          <div className="badge-week absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[var(--color-accent)] text-[var(--color-primary)] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            Últimos 7 dias
          </div>

          <h3 className="text-xl font-semibold text-center mb-2 text-[var(--color-light)]">
            Road to Marathon 2026
          </h3>

          <p className="week-range text-center text-sm text-gray-400 mb-6">
            {data ? (
              <>
                {data.week_start} ➝ {data.week_end}
              </>
            ) : (
              "-- ➝ --"
            )}
          </p>

          <ul className="metrics divide-y divide-gray-700/40 mb-6">
            <li className="flex justify-between py-2">
              <span className="text-gray-400 text-sm">Distância</span>
              <span className="text-[var(--color-light)] font-semibold">
                {data ? `${data.distance.toFixed(1)} km` : "-- km"}
              </span>
            </li>

            <li className="flex justify-between py-2">
              <span className="text-gray-400 text-sm">Ritmo médio</span>
              <span className="text-[var(--color-light)] font-semibold">
                {data ? `${data.pace} /km` : "--:-- /km"}
              </span>
            </li>

            <li className="flex justify-between py-2">
              <span className="text-gray-400 text-sm">Tempo em movimento</span>
              <span className="text-[var(--color-light)] font-semibold">
                {data ? `${(data.moving_time / 3600).toFixed(1)} h` : "-- h"}
              </span>
            </li>

            <li className="flex justify-between py-2">
              <span className="text-gray-400 text-sm">FC média</span>
              <span className="text-[var(--color-light)] font-semibold">
                {data ? `${data.heart_rate} bpm` : "-- bpm"}
              </span>
            </li>

            <li className="flex justify-between py-2">
              <span className="text-gray-400 text-sm">Nº de treinos</span>
              <span className="text-[var(--color-light)] font-semibold">
                {data ? data.activities : "--"}
              </span>
            </li>
          </ul>

          <p className="italic text-gray-400 text-center text-sm">
            “Nem sempre perfeito, mas sempre em frente.”
          </p>
        </div>
      </div>
    </section>
  );
}
