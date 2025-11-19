"use client";

import { useMemo } from "react";

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
}

// Função para formatar pace de número (min/km) para string "M:SS/km"
function formatPace(paceInMinutes: number): string {
  const minutes = Math.floor(paceInMinutes);
  const seconds = Math.round((paceInMinutes - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}/km`;
}

export default function HorizontalProgressChart({ activities }: Readonly<HorizontalProgressChartProps>) {
  console.log('📊 HorizontalProgressChart recebeu:', activities);
  console.log('📊 Número de atividades:', activities?.length);
  
  const chartData = useMemo(() => {
    if (!activities || activities.length === 0) {
      console.log('⚠️ Sem atividades para exibir');
      return [];
    }
    
    console.log('✅ Processando', activities.length, 'atividades');
    
    // Ordenar por data (mais antiga primeiro)
    const sorted = [...activities].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    console.log('📅 Atividades ordenadas:', sorted.map(a => ({ date: a.date, distance: a.distance })));
    
    // Get max distance for scaling
    const maxDistance = Math.max(...sorted.map(a => a.distance));
    console.log('📏 Distância máxima:', maxDistance);
    
    return sorted.map((activity) => {
      // Calcular o pace formatado
      const paceString = activity.pace || 
                        (activity.average_pace ? formatPace(activity.average_pace) : 'N/A');
      
      return {
        ...activity,
        paceFormatted: paceString,
        heightPercentage: (activity.distance / maxDistance) * 100,
      };
    });
  }, [activities]);

  if (chartData.length === 0) {
    console.log('❌ ChartData está vazio, mostrando mensagem');
    return (
      <div className="text-center py-12 text-gray-400">
        Sem dados para exibir
      </div>
    );
  }

  console.log('✅ Renderizando gráfico com', chartData.length, 'barras');
  const maxDistance = Math.max(...chartData.map(d => d.distance));
  
  return (
    <div className="w-full" style={{ height: '320px' }}>
      {/* Container do gráfico */}
      <div className="relative w-full h-full flex items-end pb-8">
        {/* Grid lines de fundo */}
        <div className="absolute left-0 right-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none">
          <div className="h-px bg-white/5" />
          <div className="h-px bg-white/5" />
          <div className="h-px bg-white/5" />
          <div className="h-px bg-white/5" />
          <div className="h-px bg-white/10" />
        </div>
        
        {/* BARRAS - Container principal */}
        <div className="flex-1 h-full flex items-end justify-around gap-3 pb-6">
          {chartData.map((data) => {
            const heightPercent = data.heightPercentage;
            const heightPx = `${heightPercent}%`;
            console.log(`📊 Barra (${data.date.split(' ')[0]}): ${data.distance.toFixed(2)}km = ${heightPercent.toFixed(1)}% da altura máxima (${maxDistance.toFixed(2)}km)`);
            
            return (
              <div key={data.date} className="flex flex-col items-center justify-end group relative h-full" style={{ width: '60px' }}>
                {/* Barra roxa */}
                <div 
                  className="w-full rounded-t-lg transition-all relative mb-1 hover:opacity-80"
                  style={{ 
                    height: heightPx,
                    backgroundColor: '#a855f7',
                    minHeight: '20px'
                  }}
                >
                  {/* Valor de distância no topo da barra */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-purple-300">
                    {data.distance.toFixed(1)}
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-900 px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-white/20">
                    <p className="text-xs font-bold text-white">{data.distance.toFixed(2)} km</p>
                    <p className="text-xs text-gray-400">{data.paceFormatted}</p>
                  </div>
                </div>
                
                {/* Label da data ABAIXO da barra */}
                <span className="text-xs text-gray-400">
                  {new Date(data.date).getDate()}/{new Date(data.date).getMonth() + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
