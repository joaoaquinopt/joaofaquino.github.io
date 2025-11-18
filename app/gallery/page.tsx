"use client";

import { useState } from "react";
import PageWrapper from "../../components/PageWrapper";
import MotionCard from "../../components/MotionCard";
import Reveal from "../../components/Reveal";

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Galeria de fotos (adicionar URLs reais depois)
  const photos = [
    {
      id: 1,
      url: "/assets/gallery/run1.jpg",
      title: "Primeira Corrida - 5km",
      date: "07/11/2024",
      location: "Parque da Cidade",
      description: "Início da jornada rumo à maratona"
    },
    {
      id: 2,
      url: "/assets/gallery/run2.jpg",
      title: "Treino de Resistência",
      date: "09/11/2024",
      location: "Marginal",
      description: "8.75km com pace controlado"
    },
    {
      id: 3,
      url: "/assets/gallery/placeholder.jpg",
      title: "Em breve...",
      date: "TBD",
      location: "---",
      description: "Mais fotos virão com os treinos!"
    }
  ];

  return (
    <PageWrapper>
      <section className="max-w-6xl mx-auto mt-12 px-4 min-h-screen pb-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-blue-400 mb-4">
            📸 Galeria
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Momentos registados ao longo da preparação para a maratona de 2026.
            Cada foto conta uma história, cada treino é uma conquista.
          </p>
        </div>

        {/* Photo Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo, index) => (
            <Reveal key={photo.id} delay={index * 0.1}>
              <MotionCard>
                <div 
                  className="cursor-pointer"
                  onClick={() => setSelectedImage(photo.url)}
                >
                  {/* Image Placeholder */}
                  <div className="h-64 bg-gradient-to-br from-blue-900 to-blue-950 rounded-t-xl flex items-center justify-center overflow-hidden">
                    {/* TODO: Substituir por imagens reais */}
                    <div className="text-center text-gray-400">
                      <div className="text-6xl mb-2">📷</div>
                      <p className="text-sm">Foto em breve</p>
                    </div>
                  </div>

                  {/* Photo Info */}
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {photo.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <span>📅 {photo.date}</span>
                      <span>•</span>
                      <span>📍 {photo.location}</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      {photo.description}
                    </p>
                  </div>
                </div>
              </MotionCard>
            </Reveal>
          ))}
        </div>

        {/* Empty State Message */}
        <div className="mt-16 bg-blue-900/30 border border-blue-500/30 rounded-xl p-8 text-center">
          <div className="text-5xl mb-4">🏃‍♂️</div>
          <h3 className="text-2xl font-bold text-white mb-3">
            A Galeria Está a Crescer!
          </h3>
          <p className="text-gray-300 max-w-2xl mx-auto">
            À medida que os treinos avançam, vou adicionar mais fotos e momentos especiais.
            Acompanha o Instagram <a href="https://instagram.com/joaofaquino" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">@joaofaquino</a> para 
            ver as atualizações em tempo real!
          </p>
        </div>

        {/* Social Links */}
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="https://instagram.com/joaofaquino"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all"
          >
            📸 Instagram
          </a>
          <a
            href="https://www.strava.com/athletes/joaoaquino"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all"
          >
            🏃 Strava
          </a>
        </div>
      </section>

      {/* Modal for full image (future implementation) */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl w-full">
            <p className="text-white text-center">
              🖼️ Visualização de imagem (em desenvolvimento)
            </p>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
