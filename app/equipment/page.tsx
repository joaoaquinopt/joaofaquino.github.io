"use client";

import Reveal from "../../components/Reveal";
import ModernCard from "../../components/ModernCard";
import { Watch, ShoppingBag, Shirt, Backpack } from "lucide-react";

export default function EquipmentPage() {
  const equipment = [
    {
      category: "Relógios GPS",
      icon: <Watch className="w-6 h-6 text-blue-400" />,
      items: [
        {
          name: "Garmin Forerunner 255",
          description: "Relógio GPS com métricas avançadas de corrida",
          status: "Em uso",
          specs: ["GPS Multibanda", "Autonomia: 14 dias", "Monitor de FC"]
        }
      ]
    },
    {
      category: "Ténis de Corrida",
      icon: <ShoppingBag className="w-6 h-6 text-purple-400" />,
      items: [
        {
          name: "Nike Pegasus 40",
          description: "Ténis de treino diário",
          status: "Principal",
          specs: ["Drop: 10mm", "Peso: 280g", "Amortecimento React"]
        },
        {
          name: "Adidas Ultraboost",
          description: "Para corridas longas",
          status: "Rotação",
          specs: ["Drop: 10mm", "Peso: 310g", "Boost Technology"]
        }
      ]
    },
    {
      category: "Vestuário",
      icon: <Shirt className="w-6 h-6 text-green-400" />,
      items: [
        {
          name: "Camisolas Técnicas",
          description: "Material respirável para treinos",
          status: "Essencial",
          specs: ["Dri-FIT", "Anti-odor", "Secagem rápida"]
        },
        {
          name: "Calções de Corrida",
          description: "Leves e com bolsos",
          status: "Essencial",
          specs: ["Tecido leve", "Bolsos laterais", "Forro interno"]
        }
      ]
    },
    {
      category: "Acessórios",
      icon: <Backpack className="w-6 h-6 text-orange-400" />,
      items: [
        {
          name: "Mochila de Hidratação",
          description: "Para treinos longos",
          status: "Ocasional",
          specs: ["Capacidade: 1.5L", "Bolsos múltiplos", "Ajustável"]
        },
        {
          name: "Faixa de Cardio",
          description: "Monitor de frequência cardíaca",
          status: "Em uso",
          specs: ["Bluetooth", "ANT+", "Bateria: 1 ano"]
        }
      ]
    }
  ];

  return (
    <section className="max-w-7xl mx-auto mt-8 px-4 min-h-screen pb-20">
      {/* Header */}
      <Reveal>
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Equipamento Pessoal
          </h1>
          <p className="text-gray-400 text-lg">
            Ferramentas que uso no caminho até à maratona
          </p>
        </div>
      </Reveal>

      {/* Equipment Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {equipment.map((section, index) => (
          <Reveal key={section.category} delay={index * 0.1}>
            <ModernCard
              title={section.category}
              subtitle={`${section.items.length} item${section.items.length > 1 ? 's' : ''}`}
              icon={section.icon}
              collapsible={true}
              defaultExpanded={index === 0}
            >
              <div className="space-y-4">
                {section.items.map((item) => (
                  <div 
                    key={item.name}
                    className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-lg font-semibold text-white">{item.name}</h4>
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{item.description}</p>
                    {item.specs && (
                      <div className="flex flex-wrap gap-2">
                        {item.specs.map((spec) => (
                          <span 
                            key={spec}
                            className="px-2 py-1 text-xs bg-white/5 text-gray-300 rounded-md"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ModernCard>
          </Reveal>
        ))}
      </div>

      {/* Footer Note */}
      <Reveal delay={0.4}>
        <div className="mt-12 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-2xl">
          <p className="text-gray-300 text-center">
            💡 <strong>Nota:</strong> Este equipamento é pessoal e baseado nas minhas necessidades. 
            Consulta a página de <a href="/affiliates" className="text-blue-400 hover:text-blue-300 underline">Parceiros & Afiliados</a> para 
            ver onde compro e encontrar produtos recomendados.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
