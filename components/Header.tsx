"use client";

export default function Header() {
  return (
    <header>
      <div className="flex flex-col items-center md:flex-row md:justify-between max-w-6xl mx-auto w-full">
        <h1 className="text-xl font-semibold text-white flex items-center gap-2">
          🏃‍♂️ Road to Marathon 2026
        </h1>

        <nav className="mt-2 md:mt-0">
          <ul className="flex flex-wrap justify-center gap-6 text-white font-medium list-none">
            <li><a href="#jornada" className="hover:text-blue-400">A Jornada</a></li>
            <li><a href="#progresso" className="hover:text-blue-400">Progresso</a></li>
            <li><a href="#equipamentos" className="hover:text-blue-400">Equipamentos</a></li>
            <li><a href="#contacto" className="hover:text-blue-400">Contacto</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
