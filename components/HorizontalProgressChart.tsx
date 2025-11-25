"use client";

import {
  useMemo,
  useRef,
  useCallback,
  useState,
  useEffect,
} from "react";
import type { WheelEvent } from "react";
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

type ChartDatum = {
  date: string;
  distance: number;
  label: string;
  heightPercentage: number;
  paceFormatted?: string;
};

// Formata pace numérico (min/km) para string "M:SS/km"
function formatPace(paceInMinutes: number): string {
  const minutes = Math.floor(paceInMinutes);
  const seconds = Math.round((paceInMinutes - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}/km`;
}

export default function HorizontalProgressChart({
  activities,
  mode = "run",
}: Readonly<HorizontalProgressChartProps>) {
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const [scrollState, setScrollState] = useState({ atStart: true, atEnd: false });
  const [scrollIndicator, setScrollIndicator] = useState({ width: 100, left: 0 });
  const barGapPx = 24;
  const minBarWidthPx = 56;

  const chartData = useMemo<ChartDatum[]>(() => {
    if (!activities || activities.length === 0) {
      return [];
    }

    const sorted = [...activities].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (mode === "month") {
      const byMonth = new Map<
        string,
        {
          distance: number;
          date: Date;
        }
      >();

      sorted.forEach((act) => {
        const d = new Date(act.date);
        if (Number.isNaN(d.getTime())) return;

        const key = `${d.getFullYear()}-${d.getMonth()}`;
        const current = byMonth.get(key) ?? { distance: 0, date: d };
        current.distance += act.distance;
        byMonth.set(key, current);
      });

      const monthly = Array.from(byMonth.values()).sort(
        (a, b) => a.date.getTime() - b.date.getTime()
      );

      const maxDistance = Math.max(...monthly.map((m) => m.distance), 0);

      return monthly.map((m) => ({
        date: m.date.toISOString(),
        distance: m.distance,
        label: m.date.toLocaleDateString("pt-PT", { month: "short" }),
        heightPercentage:
          maxDistance > 0 ? (m.distance / maxDistance) * 100 : 0,
      }));
    }

    const maxDistance = Math.max(...sorted.map((a) => a.distance), 0);

    return sorted.map((activity) => {
      const paceString =
        activity.pace ||
        (activity.average_pace ? formatPace(activity.average_pace) : "N/A");

      const heightPercentage =
        maxDistance > 0 ? (activity.distance / maxDistance) * 100 : 0;

      return {
        ...activity,
        label: formatActivityDayMonth(activity.date),
        paceFormatted: paceString,
        heightPercentage,
      } satisfies ChartDatum;
    });
  }, [activities, mode]);

  const updateScrollState = useCallback(() => {
    const el = scrollAreaRef.current;
    if (!el) {
      return;
    }

    const atStart = el.scrollLeft <= 8;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    setScrollState({ atStart, atEnd });

    // Update scroll indicator position
    const scrollWidth = el.scrollWidth;
    const clientWidth = el.clientWidth;
    const scrollLeft = el.scrollLeft;

    if (scrollWidth > clientWidth) {
      const thumbWidth = (clientWidth / scrollWidth) * 100;
      const thumbLeft = (scrollLeft / scrollWidth) * 100;
      setScrollIndicator({ width: thumbWidth, left: thumbLeft });
    } else {
      setScrollIndicator({ width: 100, left: 0 });
    }
  }, []);

  useEffect(() => {
    updateScrollState();

    const el = scrollAreaRef.current;
    if (!el) {
      return;
    }

    const handleResize = () => updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", handleResize);
    };
  }, [chartData.length, updateScrollState]);

  useEffect(() => {
    const el = scrollAreaRef.current;
    if (!el || chartData.length === 0) {
      return;
    }

    requestAnimationFrame(() => {
      el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
      updateScrollState();
    });
  }, [chartData.length, mode, updateScrollState]);

  const handleWheel = useCallback((event: WheelEvent<HTMLDivElement>) => {
    const el = scrollAreaRef.current;
    if (!el) {
      return;
    }

    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();
      el.scrollBy({ left: event.deltaY, behavior: "smooth" });
    }
  }, []);

  const hasData = chartData.length > 0;

  return (
    <div
      className="w-full min-w-0 flex flex-col"
      style={{
        height: "clamp(280px, 52vw, 340px)",
        background: "rgba(15,23,42,0.96)",
        borderRadius: "2rem",
        boxShadow: "0 24px 55px rgba(15,23,42,0.85)",
        padding: "1rem 0",
      }}
    >
      {!hasData ? (
        <div className="flex h-full items-center justify-center text-gray-400">
          Sem dados para exibir
        </div>
      ) : (
        <>
          {/* Chart area */}
          <div className="relative flex-1 min-h-0">
            <div className="absolute left-0 right-0 top-0 bottom-0 flex flex-col justify-between pointer-events-none px-4">
              <div className="h-px bg-white/5" />
              <div className="h-px bg-white/5" />
              <div className="h-px bg-white/5" />
              <div className="h-px bg-white/5" />
              <div className="h-px bg-white/10" />
            </div>

            <div
              ref={scrollAreaRef}
              className="h-full w-full overflow-x-auto overflow-y-hidden custom-scrollbar"
              onWheel={handleWheel}
              style={{
                paddingInline: "0.5rem",
              }}
            >
              <div
                className="flex h-full items-end justify-start w-max"
                style={{
                  gap: `${barGapPx}px`,
                  paddingInline: "0.75rem",
                  minWidth: "100%",
                  boxSizing: "border-box",
                }}
              >
                {chartData.map((data, index) => {
                  const heightPx = `${data.heightPercentage}%`;
                  const distanceValue = Number.isNaN(data.distance)
                    ? undefined
                    : data.distance.toFixed(1);
                  const barLabel = distanceValue ?? "--";
                  const tooltipDistance =
                    distanceValue !== undefined
                      ? `${distanceValue} km`
                      : "--";

                  return (
                    <div
                      key={`${data.date}-${index}`}
                      className="flex flex-col items-center justify-end group relative h-full"
                      style={{
                        flexShrink: 0,
                        minWidth: `${minBarWidthPx}px`,
                        maxWidth: "80px",
                      }}
                    >
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
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-blue-200 group-hover:opacity-0 transition-opacity">
                          {barLabel}
                        </div>

                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-gray-900 px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-white/20 min-w-[90px] text-center">
                          <p className="text-xs font-bold text-white">{tooltipDistance}</p>
                          <p className="text-xs text-blue-200">{data.label}</p>
                          {mode === "run" && (
                            <p className="text-xs text-gray-400">
                              {data.paceFormatted || "--"}
                            </p>
                          )}
                        </div>
                      </div>

                      <span className="mt-3 text-xs text-blue-200">{data.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Fade indicators */}
            {!scrollState.atStart && (
              <div className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-[#0f172ae6] to-transparent" />
            )}
            {!scrollState.atEnd && (
              <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-[#0f172ae6] to-transparent" />
            )}
          </div>

          {/* Scrollbar area - separate from chart */}
          <div className="h-4 mt-2 px-4">
            <div className="h-full w-full bg-slate-800/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-200"
                style={{
                  width: `${scrollIndicator.width}%`,
                  marginLeft: `${scrollIndicator.left}%`,
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
