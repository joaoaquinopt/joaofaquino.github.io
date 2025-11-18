"use client";

import Reveal from "../../components/Reveal";
import MotionCard from "../../components/MotionCard";
import PageWrapper from "../../components/PageWrapper";

export default function EquipmentPage() {
  const equipment = [
    {
      category: "⌚ Relógios GPS",
      items: [
        {
          name: "Garmin Forerunner 255",
          description: "Relógio GPS com métricas avançadas de corrida",
          status: "Em uso"
        }
      ]
    },
    {
      category: "👟 Ténis de Corrida",
      items: [
        {
          name: "Nike Pegasus 40",
          description: "Ténis de treino diário",
          status: "Principal"
        },
        {
          name: "Adidas Ultraboost",
          description: "Para corridas longas",
          status: "Rotação"
        }
      ]
    },
    {
      category: "👕 Vestuário",
      items: [
        {
          name: "Camisolas Técnicas",
          description: "Material respirável para treinos",
          status: "Essencial"
        },
        {
          name: "Calções de Corrida",
          description: "Leves e com bolsos",
          status: "Essencial"
        }
      ]
    },
    {
      category: "🎒 Acessórios",
      items: [
        {
          name: "Mochila de Hidratação",
          description: "Para treinos longos",
          status: "Ocasional"
        },
        {
          name: "Faixa de Cardio",
          description: "Monitor de frequência cardíaca",
          status: "Em uso"
        }
      ]
    }
  ];

  return (
    <PageWrapper>
      <section className="max-w-6xl mx-auto mt-12 px-4 min-h-screen pb-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-blue-400 mb-4">
            Equipamento
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            O equipamento que uso na minha preparação para a maratona de 2026.
          </p>
        </div>

        {/* Equipment Grid */}
        <div className="space-y-12">
          {equipment.map((section, sectionIndex) => (
            <div key={section.category}>
              <Reveal delay={sectionIndex * 0.1}>
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  {section.category}
                </h2>
              </Reveal>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {section.items.map((item, itemIndex) => (
                  <Reveal key={item.name} delay={(sectionIndex * 0.1) + (itemIndex * 0.05)}>
                    <MotionCard>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-bold text-white">{item.name}</h3>
                          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            {item.status}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                      </div>
                    </MotionCard>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-16 bg-blue-900/30 border border-blue-500/30 rounded-xl p-6 text-center">
          <p className="text-gray-300">
            💡 <strong>Nota:</strong> Este equipamento é pessoal e baseado nas minhas necessidades.
            Consulta a página de <a href="/affiliates" className="text-blue-400 hover:underline">Parceiros & Afiliados</a> para 
            ver onde compro e encontrar produtos recomendados.
          </p>
        </div>
      </section>
    </PageWrapper>
  );
}