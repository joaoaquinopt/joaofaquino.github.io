"use client";

import { useMemo } from "react";
import { formatActivityDayMonth } from "../lib/dateUtils";

interface Activity {
  date: string;
  distance: number;
  total_time?: number;
  moving_time?: number;
  average_pace?: number;
  pace?: string;
}

interface HorizontalProgressChartProps {
  activities: Activity[];
  mode?: "run" | "month";
}

// Função para formatar pace de número (min/km) para string "M:SS/km"
function formatPace(paceInMinutes: number): string {
  const minutes = Math.floor(paceInMinutes);
  const seconds = Math.round((paceInMinutes - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}/km`;
}

export default function HorizontalProgressChart({
  activities,
  mode = "run",
}: Readonly<HorizontalProgressChartProps>) {
  console.log("📊 HorizontalProgressChart recebeu:", activities);
  console.log("📊 Número de atividades:", activities?.length);
  console.log("📊 Modo:", mode);

  const chartData = useMemo(() => {
    if (!activities || activities.length === 0) {
      console.log("⚠️ Sem atividades para exibir");
      return [];
    }

    console.log("✅ Processando", activities.length, "atividades");

    // Ordenar por data (mais antiga -> mais recente)
    const sorted = [...activities].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // 🚩 MODO MÊS: agrega por mês/ano
    if (mode === "month") {
      const byMonth = new Map<
        string,
        { distance: number; date: Date }
      >();

      sorted.forEach((act) => {
        const d = new Date(act.date);
        if (isNaN(d.getTime())) return;

        const key = `${d.getFullYear()}-${d.getMonth()}`; // ex: 2025-10
        const current = byMonth.get(key) ?? { distance: 0, date: d };
        current.distance += act.distance;
        byMonth.set(key, current);
      });

      const monthly = Array.from(byMonth.values()).sort(
        (a, b) => a.date.getTime() - b.date.getTime()
      );

      const maxDistance = Math.max(...monthly.map((m) => m.distance), 0);
      console.log("📏 Distância máxima (mês):", maxDistance);

      return monthly.map((m) => {
        const monthLabel = m.date.toLocaleDateString("pt-PT", {
          month: "short",
        }); // "nov", "dez"...

        return {
          date: m.date.toISOString(),
          distance: m.distance,
          label: monthLabel,
          paceFormatted: undefined,
          heightPercentage:
            maxDistance > 0 ? (m.distance / maxDistance) * 100 : 0,
        };
      });
    }

    // 🚩 MODO TREINO (run): 1 barra = 1 corrida
    const maxDistance = Math.max(...sorted.map((a) => a.distance), 0);
    console.log("📏 Distância máxima (treino):", maxDistance);

    return sorted.map((activity) => {
      const paceString =
        activity.pace ||
        (activity.average_pace ? formatPace(activity.average_pace) : "N/A");

      const heightPercentage =
        maxDistance > 0 ? (activity.distance / maxDistance) * 100 : 0;

      return {
        ...activity,
        paceFormatted: paceString,
        label: formatActivityDayMonth(activity.date), // "DD/MM"
        heightPercentage,
      };
    });
  }, [activities, mode]);

  if (chartData.length === 0) {
    console.log("❌ ChartData está vazio, mostrando mensagem");
    return (
      <div className="text-center py-12 text-gray-400">
        Sem dados para exibir
      </div>
    );
  }

  console.log("✅ Renderizando gráfico com", chartData.length, "barras");

  return (
    <div
      className="w-full"
      style={{
        height: "320px",
        background: "rgba(15,23,42,0.96)",
        borderRadius: "2rem",
        boxShadow: "0 24px 55px rgba(15,23,42,0.85)",
      }}
    >
      <div className="relative w-full h-full flex items-end pb-8">
        {/* Grid de fundo */}
        <div className="absolute left-0 right-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none">
          <div className="h-px bg-white/5" />
          <div className="h-px bg-white/5" />
          <div className="h-px bg-white/5" />
          <div className="h-px bg-white/5" />
          <div className="h-px bg-white/10" />
        </div>

        {/* Barras */}
        <div className="flex-1 h-full flex items-end justify-around gap-4 pb-6">
          {chartData.map((data, index) => {
            const heightPercent = data.heightPercentage;
            const heightPx = `${heightPercent}%`;

            const dateLabel = data.label || "--/--";
            const tooltipDate = data.label || "Sem data";

            const distLabel = isNaN(data.distance)
              ? "--"
              : `${data.distance.toFixed(1)} km`;

            return (
              <div
                key={`${data.date}-${index}`}
                className="flex flex-col items-center justify-end group relative h-full"
                style={{ width: "60px" }}
              >
                {/* Barra */}
                <div
                  className="w-full rounded-t-xl transition-all relative mb-1 hover:opacity-80 group"
                  style={{
                    height: heightPx,
                    background:
                      "linear-gradient(135deg, #1E4D8B 0%, #2563eb 100%)",
                    minHeight: "20px",
                    boxShadow: "0 8px 24px rgba(30,77,139,0.25)",
                  }}
                >
                  {/* Valor fixo no topo */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-blue-200 group-hover:opacity-0 transition-opacity">
                    {distLabel}
                  </div>

                  {/* Tooltip no hover */}
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-gray-900 px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-white/20 min-w-[90px] text-center">
                    <p className="text-xs font-bold text-white">
                      {distLabel}
                    </p>
                    <p className="text-xs text-blue-200">{tooltipDate}</p>
                    {mode === "run" && (
                      <p className="text-xs text-gray-400">
                        {data.paceFormatted || "--"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Label em baixo (dia ou mês) */}
                <span className="text-xs text-blue-200">{dateLabel}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
