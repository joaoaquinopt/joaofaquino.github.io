"use client";

import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface StravaActivity {
  date: string;
  distance: number;
  moving_time: number;
  pace: string;
}

interface ProgressChartsProps {
  activities: StravaActivity[];
}

export default function ProgressCharts({ activities }: ProgressChartsProps) {
  // Preparar dados para os gráficos
  const chartData = activities
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((activity, index) => {
      const date = new Date(activity.date);
      const paceSeconds = activity.moving_time / activity.distance;
      const paceMinutes = paceSeconds / 60;

      return {
        name: date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' }),
        fullDate: date.toLocaleDateString('pt-PT'),
        distancia: Math.round(activity.distance * 100) / 100,
        tempo: Math.round(activity.moving_time / 60),
        pace: Math.round(paceMinutes * 100) / 100,
        paceFormatted: activity.pace,
        corrida: `#${index + 1}`,
      };
    });

  // Calcular distância acumulada
  let cumulative = 0;
  const cumulativeData = chartData.map(item => {
    cumulative += item.distancia;
    return {
      ...item,
      acumulado: Math.round(cumulative * 100) / 100,
    };
  });

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 border border-blue-500/30 rounded-lg p-4 shadow-xl">
          <p className="text-white font-semibold mb-2">{payload[0]?.payload?.fullDate}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value}</span>
              {entry.dataKey === 'distancia' && ' km'}
              {entry.dataKey === 'tempo' && ' min'}
              {entry.dataKey === 'pace' && ' min/km'}
              {entry.dataKey === 'acumulado' && ' km'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>Sem dados suficientes para gerar gráficos.</p>
        <p className="text-sm mt-2">Execute o script Python para sincronizar mais atividades.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Gráfico 1: Distância por Corrida */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          📈 Distância por Corrida
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          Evolução da distância percorrida em cada treino
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E4D8B" opacity={0.3} />
            <XAxis 
              dataKey="name" 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
              label={{ value: 'km', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="distancia" fill="#3B82F6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico 2: Evolução do Pace */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          ⏱️ Evolução do Pace
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          Ritmo médio ao longo das corridas (quanto menor, melhor)
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E4D8B" opacity={0.3} />
            <XAxis 
              dataKey="name" 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
              label={{ value: 'min/km', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
              reversed
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: '#9CA3AF' }}
            />
            <Line 
              type="monotone" 
              dataKey="pace" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', r: 5 }}
              activeDot={{ r: 7 }}
              name="Pace"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico 3: Distância Acumulada */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          📊 Distância Acumulada
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          Total de quilómetros percorridos até agora
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={cumulativeData}>
            <defs>
              <linearGradient id="colorAcumulado" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E4D8B" opacity={0.3} />
            <XAxis 
              dataKey="name" 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
              label={{ value: 'km acumulados', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: '#9CA3AF' }}
            />
            <Area 
              type="monotone" 
              dataKey="acumulado" 
              stroke="#3B82F6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorAcumulado)"
              name="Acumulado"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-center">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-2xl font-bold text-white">
            {cumulativeData[cumulativeData.length - 1]?.acumulado || 0} km
          </div>
          <div className="text-blue-200 text-sm mt-1">Total Percorrido</div>
          <div className="text-blue-300 text-xs mt-2">
            {((cumulativeData[cumulativeData.length - 1]?.acumulado / 42.195) * 100).toFixed(1)}% da maratona
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 text-center">
          <div className="text-3xl mb-2">⚡</div>
          <div className="text-2xl font-bold text-white">
            {chartData.length > 0 
              ? (chartData.reduce((sum, d) => sum + d.pace, 0) / chartData.length).toFixed(2)
              : '0.00'
            } min/km
          </div>
          <div className="text-green-200 text-sm mt-1">Pace Médio</div>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 text-center">
          <div className="text-3xl mb-2">🔥</div>
          <div className="text-2xl font-bold text-white">
            {chartData.length > 0 
              ? Math.max(...chartData.map(d => d.distancia))
              : 0
            } km
          </div>
          <div className="text-purple-200 text-sm mt-1">Maior Distância</div>
        </div>
      </div>
    </div>
  );
}
