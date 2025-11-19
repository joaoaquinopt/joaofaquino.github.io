import Reveal from "../components/Reveal";

export default function HomePage() {
  return (
    <section className="max-w-3xl mx-auto text-center mt-12 md:mt-20 px-4 md:px-6 space-y-6 md:space-y-8 min-h-[70vh] flex flex-col justify-center">
      <Reveal>
        <h1 className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">A Jornada</h1>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
          Sou João Aquino, QA Engineer e corredor amador.
        </p>
      </Reveal>

      <Reveal delay={0.4}>
        <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
          Este espaço documenta o meu caminho até à maratona de 2026 —
          com dados reais, desafios, noites sem sono e muita persistência.
        </p>
      </Reveal>

      <Reveal delay={0.6}>
        <p className="italic text-base md:text-lg text-gray-500 mt-8">
          "Nem sempre perfeito, mas sempre em frente."
        </p>
      </Reveal>
    </section>
  );
}
