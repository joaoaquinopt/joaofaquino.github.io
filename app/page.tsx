import Reveal from "../components/Reveal";

export default function HomePage() {
  return (
    <section className="max-w-3xl mx-auto text-center mt-12 md:mt-20 px-4 md:px-6 space-y-6 md:space-y-8 min-h-[70vh] flex flex-col justify-center">
      <Reveal>
        <h1 className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">A Jornada</h1>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
          Sou João Aquino, QA Engineer, pai de uma criança linda, o Davi, e corredor amador.
        </p>
      </Reveal>

      <Reveal delay={0.4}>
        <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
          Comecei a correr porque o meu corpo pediu ajuda.
          A insónia estava a piorar, o cigarro a aumentar e a energia a desaparecer.
          Senti que precisava de um rumo — algo que me puxasse para fora do buraco.
          A corrida virou isso.
          Este é o diário da minha tentativa de me transformar.
        </p>
      </Reveal>

      <Reveal delay={0.6}>
        <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
          Esta jornada não é sobre performance perfeita.
          É sobre disciplina imperfeita.
          É sobre tentar todos os dias, falhar alguns, mas continuar.
          A minha meta: cruzar a linha de chegada da minha primeira maratona em 2026.
        </p>
      </Reveal>

      <Reveal delay={0.8}>
        <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
          Luto com a insónia há anos.
          Já fiquei quase 30 dias sem fumar — mas voltei.
          Trabalho, sou pai, falho nos horários, acordo cansado.
          Mas cada treino é um passo contra tudo isso.
        </p>
      </Reveal>

      <Reveal delay={1.0}>
        <p className="italic text-base md:text-lg text-gray-500 mt-8">
          "Nem sempre perfeito, mas sempre em frente."
        </p>
      </Reveal>
    </section>
  );
}
