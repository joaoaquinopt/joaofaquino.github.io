"use client";

import PageWrapper from "../../components/PageWrapper";
import MotionCard from "../../components/MotionCard";
import Reveal from "../../components/Reveal";

export default function ContactPage() {
  const socialLinks = [
    {
      name: "Instagram",
      icon: "📸",
      handle: "@joaofaquino",
      url: "https://instagram.com/joaofaquino",
      description: "Acompanha os treinos diários",
      color: "from-purple-600 to-pink-600"
    },
    {
      name: "TikTok",
      icon: "🎵",
      handle: "@joaofaquino",
      url: "https://tiktok.com/@joaofaquino",
      description: "Vídeos curtos e motivacionais",
      color: "from-black to-gray-800"
    },
    {
      name: "Facebook",
      icon: "👥",
      handle: "João Aquino",
      url: "https://www.facebook.com/joaomiguel.aquino.9/",
      description: "Atualizações e posts",
      color: "from-blue-600 to-blue-800"
    },
    {
      name: "LinkedIn",
      icon: "💼",
      handle: "João Aquino",
      url: "https://www.linkedin.com/in/jmfaquino/",
      description: "Perfil profissional",
      color: "from-blue-700 to-blue-900"
    },
    {
      name: "Strava",
      icon: "🏃",
      handle: "João Aquino",
      url: "https://www.strava.com/athletes/joaoaquino",
      description: "Todas as corridas registadas",
      color: "from-orange-600 to-red-600"
    },
    {
      name: "GitHub",
      icon: "💻",
      handle: "@joaoaquinopt",
      url: "https://github.com/joaoaquinopt",
      description: "Projetos e código",
      color: "from-gray-700 to-gray-900"
    }
  ];

  return (
    <PageWrapper>
      <section className="max-w-6xl mx-auto mt-12 px-4 min-h-screen pb-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-blue-400 mb-4">
            Contacto
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-6">
            Conecta-te comigo nas redes sociais! Partilho regularmente os meus treinos,
            progresso e a jornada rumo à maratona de 2026.
          </p>
          <div className="flex justify-center">
            <a
              href="mailto:joaofaquino@gmail.com"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105"
            >
              ✉️ joaofaquino@gmail.com
            </a>
          </div>
        </div>

        {/* Social Links Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {socialLinks.map((social, index) => (
            <Reveal key={social.name} delay={index * 0.1}>
              <MotionCard>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 hover:scale-105 transition-transform"
                >
                  <div className={`bg-gradient-to-br ${social.color} rounded-xl p-6 text-center mb-4`}>
                    <div className="text-5xl mb-2">{social.icon}</div>
                    <h3 className="text-xl font-bold text-white">{social.name}</h3>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-blue-400 font-semibold mb-1">{social.handle}</p>
                    <p className="text-gray-400 text-sm">{social.description}</p>
                  </div>
                </a>
              </MotionCard>
            </Reveal>
          ))}
        </div>

        {/* Quick Links */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white text-center mb-6">
            🔗 Links Rápidos
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <a
              href="https://instagram.com/joaofaquino"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold text-center transition-all"
            >
              📸 Instagram
            </a>
            <a
              href="https://www.strava.com/athletes/joaoaquino"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold text-center transition-all"
            >
              🏃 Strava
            </a>
            <a
              href="https://linkedin.com/in/joaoaquino"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold text-center transition-all"
            >
              💼 LinkedIn
            </a>
          </div>
        </div>

        {/* Footer Message */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            💬 Sente-te à vontade para me contactar através de qualquer uma destas plataformas.
            <br />
            Respondo sempre que possível!
          </p>
        </div>
      </section>
    </PageWrapper>
  );
}
