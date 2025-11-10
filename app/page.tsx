'use client';
import { useEffect, useState } from "react";
import ActivityCard from "../components/ActivityCard";
import WeeklyStats from "../components/WeeklyStats";

interface Activity {
  name: string;
  distance: number;
  moving_time: number;
  pace: string;
  date: string;
}

export default function HomePage() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetch("/data/strava_summary.json")
      .then((res) => res.json())
      .then((data) => setActivities(data))
      .catch((err) => console.error("Erro ao carregar dados:", err));
  }, []);

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4 text-center">
        Jornada até à Maratona 2026
      </h1>
      <p className="text-center mb-8 text-gray-600">
        Dados reais de treino — esforço, ritmo e consistência.
      </p>
      <WeeklyStats activities={activities} />
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {activities.map((a, idx) => (
          <ActivityCard key={idx} activity={a} />
        ))}
      </div>
    </section>
  );
}