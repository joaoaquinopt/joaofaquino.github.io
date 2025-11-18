"use client";

import Reveal from "../../components/Reveal";
import MotionCard from "../../components/MotionCard";

export default function EquipamentosPage() {
  return (
    <section className="max-w-5xl mx-auto text-center mt-20 px-4">
      <h1 className="text-3xl font-bold text-blue-400 mb-4">
        Equipamentos e Parcerias
      </h1>
      <p className="text-gray-300 mb-8">
        Ferramentas, produtos e marcas que fazem parte da minha jornada.
      </p>

      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-6 mt-8">
        <Reveal delay={0.1}>
          <MotionCard>
            <h2 className="text-lg font-semibold text-white">Garmin</h2>
            <p className="text-gray-400 text-sm mt-2">Relógios e GPS</p>
          </MotionCard>
        </Reveal>

        <Reveal delay={0.25}>
          <MotionCard>
            <h2 className="text-lg font-semibold text-white">Decathlon</h2>
            <p className="text-gray-400 text-sm mt-2">Equipamentos esportivos</p>
          </MotionCard>
        </Reveal>

        <Reveal delay={0.4}>
          <MotionCard>
            <h2 className="text-lg font-semibold text-white">Amazon</h2>
            <p className="text-gray-400 text-sm mt-2">Acessórios e suplementos</p>
          </MotionCard>
        </Reveal>
      </div>
    </section>
  );
}