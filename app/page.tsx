import Reveal from "../components/Reveal";

export default function HomePage() {
  return (
    <section className="max-w-3xl mx-auto text-center mt-20 px-4 space-y-8">
      <Reveal>
        <h1 className="text-3xl font-bold text-blue-400">A Jornada</h1>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="text-gray-300">
          Sou João Aquino, QA Engineer e corredor amador.
        </p>
      </Reveal>

      <Reveal delay={0.4}>
        <p className="text-gray-400">
          Este espaço documenta o meu caminho até à maratona de 2026 —
          com dados reais, desafios, noites sem sono e muita persistência.
        </p>
      </Reveal>

      <Reveal delay={0.6}>
        <p className="italic text-gray-500">
          “Nem sempre perfeito, mas sempre em frente.”
        </p>
      </Reveal>
    </section>
  );
}
