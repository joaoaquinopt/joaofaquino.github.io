"use client";

import { useState, useEffect } from "react";
import PageWrapper from "../../components/PageWrapper";
import Reveal from "../../components/Reveal";
import styles from "./gallery.module.css";

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string>("all");

  // Galeria organizada por eventos/corridas
  const galleryEvents = [
    {
      id: "training-nov-2024",
      name: "Treinos Novembro 2024",
      date: "Novembro 2024",
      photos: [
        {
          id: 1,
          url: "/assets/gallery/training-nov/run1.jpg",
          title: "Primeira Corrida - 5km",
          date: "07/11/2024",
          location: "Parque da Cidade",
          description: "Início da jornada rumo à maratona"
        },
        {
          id: 2,
          url: "/assets/gallery/training-nov/run2.jpg",
          title: "Treino de Resistência",
          date: "09/11/2024",
          location: "Marginal",
          description: "8.75km com pace controlado"
        }
      ]
    },
    {
      id: "race-dec-2024",
      name: "Corrida de São Silvestre",
      date: "31/12/2024",
      photos: [
        {
          id: 3,
          url: "/assets/gallery/sao-silvestre/start.jpg",
          title: "Linha de Partida",
          date: "31/12/2024",
          location: "Centro da Cidade",
          description: "Preparado para os 10km"
        },
        {
          id: 4,
          url: "/assets/gallery/sao-silvestre/finish.jpg",
          title: "Meta Alcançada",
          date: "31/12/2024",
          location: "Centro da Cidade",
          description: "10km concluídos com sucesso!"
        }
      ]
    },
    {
      id: "training-jan-2025",
      name: "Treinos Janeiro 2025",
      date: "Janeiro 2025",
      photos: [
        {
          id: 5,
          url: "/assets/gallery/training-jan/long-run.jpg",
          title: "Long Run 15km",
          date: "15/01/2025",
          location: "Percurso Marginal",
          description: "Maior distância até agora"
        }
      ]
    }
  ];

  // Filtrar fotos por evento
  const allPhotos = galleryEvents.flatMap(event =>
    event.photos.map(photo => ({ ...photo, eventName: event.name }))
  );

  const filteredPhotos = selectedEvent === "all"
    ? allPhotos
    : galleryEvents.find(e => e.id === selectedEvent)?.photos.map(p => ({ ...p, eventName: galleryEvents.find(e => e.id === selectedEvent)?.name })) || [];

  // ESC key handler for modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedImage) {
        setSelectedImage(null);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [selectedImage]);

  return (
    <PageWrapper>
      <div className={styles.galleryPage}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>📸 Galeria</h1>
          <p className={styles.subtitle}>
            Momentos registados ao longo da preparação para a maratona de 2026.
            Cada foto conta uma história, cada treino é uma conquista.
          </p>
        </div>

        {/* Main Content: Sidebar + Photos */}
        <div className={styles.content}>
          {/* Sidebar with Event Filters */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarSticky}>
              <h2 className={styles.sidebarTitle}>Eventos</h2>
              <div className={styles.eventList}>
                <button
                  onClick={() => setSelectedEvent("all")}
                  className={`${styles.eventButton} ${selectedEvent === "all" ? styles.active : ""}`}
                  type="button"
                  aria-label="Mostrar todas as fotos"
                >
                  <span className={styles.eventName}>Todas as Fotos</span>
                  <span className={styles.eventCount}>{allPhotos.length}</span>
                </button>
                {galleryEvents.map(event => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event.id)}
                    className={`${styles.eventButton} ${selectedEvent === event.id ? styles.active : ""}`}
                    type="button"
                    aria-label={`Filtrar por ${event.name}`}
                  >
                    <div>
                      <span className={styles.eventName}>{event.name}</span>
                      <span className={styles.eventDate}>{event.date}</span>
                    </div>
                    <span className={styles.eventCount}>{event.photos.length}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Photo Grid */}
          <main className={styles.mainContent}>
            {filteredPhotos.length > 0 ? (
              <div className={styles.photoGrid}>
                {filteredPhotos.map((photo, index) => (
                  <Reveal key={photo.id} delay={index * 0.05}>
                    <button
                      className={styles.photoCard}
                      onClick={() => setSelectedImage(photo.url)}
                      type="button"
                      aria-label={`Ver foto: ${photo.title}`}
                    >
                      {/* Image Placeholder */}
                      <div className={styles.photoImagePlaceholder}>
                        <div className={styles.photoPlaceholderContent}>
                          <div className={styles.photoIcon}>📷</div>
                          <p className={styles.photoPlaceholderText}>Foto em breve</p>
                        </div>
                      </div>

                      {/* Photo Info */}
                      <div className={styles.photoInfo}>
                        <h3 className={styles.photoTitle}>{photo.title}</h3>
                        <div className={styles.photoMeta}>
                          <span>📅 {photo.date}</span>
                          <span>•</span>
                          <span>📍 {photo.location}</span>
                        </div>
                        {'eventName' in photo && selectedEvent === "all" && (
                          <div className={styles.photoEventBadge}>
                            🏃 {photo.eventName}
                          </div>
                        )}
                        <p className={styles.photoDescription}>{photo.description}</p>
                      </div>
                    </button>
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🏃‍♂️</div>
                <h3 className={styles.emptyTitle}>Nenhuma foto neste evento</h3>
                <p className={styles.emptyText}>
                  Seleciona outro evento na sidebar ou vê todas as fotos.
                </p>
              </div>
            )}

            {/* Social Links */}
            <div className={styles.socialLinks}>
              <a
                href="https://instagram.com/joaofaquino"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialButton}
                style={{ background: 'linear-gradient(135deg, #833AB4 0%, #E1306C 100%)' }}
              >
                📸 Instagram
              </a>
              <a
                href="https://www.strava.com/athletes/joaoaquino"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialButton}
                style={{ background: 'linear-gradient(135deg, #FC4C02 0%, #E34402 100%)' }}
              >
                🏃 Strava
              </a>
            </div>
          </main>
        </div>
      </div>

      {/* Modal for full image */}
      {selectedImage && (
        <div
          className={styles.modal}
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            className={styles.closeButton}
            onClick={() => setSelectedImage(null)}
            type="button"
            aria-label="Fechar visualização"
          >
            ✕
          </button>
          <div className={styles.modalContent}>
            <p className={styles.modalPlaceholder}>
              🖼️ Visualização de imagem (em desenvolvimento)
            </p>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
