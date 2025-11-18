export default function EquipmentPartners() {
  return (
    <section id="equipamentos" className="py-16 px-6 max-w-4xl mx-auto">
      <h2 className="border-b-2 border-[var(--azul-claro)] inline-block pb-1">
        Equipamentos e Parceiros
      </h2>
      <p className="mt-3 text-gray-300">
        Produtos e ferramentas que uso na jornada:
      </p>

      <div className="flex flex-wrap justify-center gap-6 mt-6">
        {["Garmin", "Decathlon", "Amazon"].map((brand) => (
          <ul
            key={brand}
            className="bg-[var(--azul-medio)] hover:bg-[var(--azul-claro)] transition-colors px-5 py-2 rounded-xl text-sm font-semibold"
          >
            <li>
              <a href={`#${brand.toLowerCase()}`} className="hover:text-blue-400">
                {brand}
              </a>
            </li>
          </ul>
        ))}
      </div>

      <p className="text-xs mt-4 text-gray-500 italic">
        *Alguns links poderão conter afiliação no futuro.
      </p>
    </section>
  );
}
