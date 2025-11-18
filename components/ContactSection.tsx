export default function ContactSection() {
  return (
    <section id="contacto" className="py-16 px-6 max-w-4xl mx-auto">
      <h2 className="border-b-2 border-[var(--azul-claro)] inline-block pb-1">Contacto</h2>
      <p className="mt-3">
        Entra em contacto:{" "}
        <a href="mailto:contacto@joaofaquino.run" className="text-[var(--azul-claro)] underline">
          contacto@joaofaquino.run
        </a>
      </p>

      <div className="flex justify-center gap-5 mt-6 text-gray-400">
        {["Instagram", "TikTok", "Threads", "Facebook"].map((net) => (
          <span key={net} className="hover:text-[var(--azul-claro)] cursor-pointer">
            {net}
          </span>
        ))}
      </div>
    </section>
  );
}
