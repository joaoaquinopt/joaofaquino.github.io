import Header from "../components/Header";
import ProgressSection from "../components/ProgressSection";
import { Watch, Dumbbell, ShoppingBag } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <section id="jornada">
          <h2>A Jornada</h2>
          <p>Soy João Aquino, QA Engineer e corredor amador.</p>
          <p>
            Este espaço documenta o meu caminho até à maratona de 2026 —
            com dados reais, desafios e muita persistência.
          </p>
          <p><em>“Nem sempre perfeito, mas sempre em frente.”</em></p>
        </section>

        <ProgressSection />

        <section id="equipamentos" className="text-center mt-20">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">
            Equipamentos e Parceiros
          </h2>
          <p className="text-gray-300 mb-8">
            Produtos e ferramentas que uso na jornada:
          </p>

          <div className="flex flex-wrap justify-center gap-7 mt-7">
            {/* Garmin */}
            <a
              href="https://www.garmin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-blue-500/30"
            >
              <Watch className="w-5 h-5" />
              Garmin
            </a>

            {/* Decathlon */}
            <a
              href="https://www.decathlon.pt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-blue-500/30"
            >
              <Dumbbell className="w-5 h-5" />
              Decathlon
            </a>

            {/* Amazon */}
            <a
              href="https://www.amazon.pt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-blue-500/30"
            >
              <ShoppingBag className="w-5 h-5" />
              Amazon
            </a>
          </div>
        </section>

        <section id="contacto">
          <h2>Contacto</h2>
          <p>
            Entra em contacto: <a href="mailto:jmfaquino@gmail.com" className="text-blue-400 hover:underline">
              jmfaquino@gmail.com
            </a>
          </p>
        </section>
      </main>
    </>
  );
}
