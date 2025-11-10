interface Activity {
  distance: number;
  moving_time: number;
}

export default function WeeklyStats({ activities }: { activities: Activity[] }) {
  if (!activities.length) return null;

  const totalDistance = activities.reduce((acc, a) => acc + a.distance, 0);
  const totalTime = activities.reduce((acc, a) => acc + a.moving_time, 0);

  return (
    <div className="bg-[#0A2342] text-white rounded-2xl p-4 text-center shadow-md mb-6">
      <h3 className="font-semibold text-lg mb-2">Progresso Semanal</h3>
      <p>{totalDistance.toFixed(1)} km corridos</p>
      <p>{Math.round(totalTime / 60)} min totais</p>
    </div>
  );
}