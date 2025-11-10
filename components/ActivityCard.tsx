interface Activity {
  name: string;
  distance: number;
  moving_time: number;
  pace: string;
  date: string;
}

export default function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-all">
      <h3 className="font-semibold text-lg">{activity.name}</h3>
      <p className="text-sm text-gray-500">{activity.date}</p>
      <div className="mt-3 text-sm">
        <p>🏃‍♂️ {activity.distance.toFixed(1)} km</p>
        <p>⏱️ {Math.round(activity.moving_time / 60)} min</p>
        <p>⚡ Ritmo médio: {activity.pace} min/km</p>
      </div>
    </div>
  );
}