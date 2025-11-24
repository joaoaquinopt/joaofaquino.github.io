"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import PageWrapper from "../../components/PageWrapper";
import Reveal from "../../components/Reveal";
import styles from "./gallery.module.css";

interface RawPhoto {
  id?: string | number;
  filename?: string;
  src?: string;
  url?: string;
  title?: string;
  date?: string;
  location?: string;
  description?: string;
}

interface RawEvent {
  id: string;
  name?: string;
  date?: string;
  photos?: RawPhoto[];
}

interface GalleryPhoto {
  id: string;
  src: string;
  title: string;
  date?: string;
  location?: string;
  description?: string;
  eventId: string;
  eventName: string;
}

interface GalleryEvent {
  id: string;
  name: string;
  date?: string;
  photoCount: number;
}

export default function GalleryPage() {
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<GalleryPhoto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        // ⚠️ IMPORTANTE: caminho estático correto para o JSON
        const res = await fetch("/data/gallery_index.json");

        if (!res.ok) {
          console.error("Falha ao carregar gallery_index.json", res.status);
          setHasError(true);
          return;
        }

        const data = await res.json();
        const rawEvents: RawEvent[] = Array.isArray(data.events) ? data.events : [];

        const mappedEvents: GalleryEvent[] = rawEvents.map((ev) => ({
          id: ev.id,
          name: ev.name ?? ev.id,
          date: ev.date,
          photoCount: ev.photos?.length ?? 0,
        }));

        const mappedPhotos: GalleryPhoto[] = rawEvents.flatMap((ev) => {
          const evName = ev.name ?? ev.id;
          return (ev.photos ?? []).map((photo, index) => {
            const id = String(photo.id ?? `${ev.id}-${photo.filename ?? index}`);
            const src =
              photo.src ??
              photo.url ??
              `/assets/gallery/${ev.id}/${photo.filename ?? `${id}.jpg`}`;

            return {
              id,
              src,
              title: photo.title ?? photo.filename?.toString() ?? id,
              date: photo.date,
              location: photo.location,
              description:
                photo.description ??
                "Momento registado durante a preparação para a maratona.",
              eventId: ev.id,
              eventName: evName,
            };
          });
        });

        // Ordenar eventos: mais recentes em cima (se tiverem data)
        mappedEvents.sort((a, b) => {
          if (!a.date || !b.date) return 0;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        setEvents(mappedEvents);
        setPhotos(mappedPhotos);
      } catch (err) {
        console.error("Erro ao carregar galeria:", err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadGallery();
  }, []);

  const allPhotos = photos;
  const filteredPhotos =
    selectedEvent === "all"
      ? allPhotos
      : allPhotos.filter((p) => p.eventId === selectedEvent);

  return (
    <PageWrapper>
      <div className={styles.galleryPage}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>Galeria</h1>
          <p className={styles.subtitle}>
            Momentos registados ao longo da preparação para a maratona de 2026.
            Cada foto conta uma história, cada treino é uma conquista.
          </p>
        </header>

        <div className={styles.content}>
          {/* SIDEBAR – Eventos */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarSticky}>
              <h2 className={styles.sidebarTitle}>Eventos</h2>

              {isLoading ? (
                <p className={styles.loadingText}>A carregar eventos…</p>
              ) : hasError ? (
                <p className={styles.errorText}>
                          Não foi possível carregar a galeria. Verifica se o ficheiro{" "}
                          <code>public/data/gallery_index.json</code> existe.
                </p>
              ) : (
                <div className={styles.eventList}>
                  <button
                    type="button"
                    onClick={() => setSelectedEvent("all")}
                    className={`${styles.eventButton} ${
                      selectedEvent === "all" ? styles.active : ""
                    }`}
                  >
                    <div>
                      <span className={styles.eventName}>Todas as fotos</span>
                      <span className={styles.eventDate}>Desde 2025</span>
                    </div>
                    <span className={styles.eventCount}>{allPhotos.length}</span>
                  </button>

                  {events.map((event) => (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => setSelectedEvent(event.id)}
                      className={`${styles.eventButton} ${
                        selectedEvent === event.id ? styles.active : ""
                      }`}
                    >
                      <div>
                        <span className={styles.eventName}>{event.name}</span>
                        {event.date && (
                          <span className={styles.eventDate}>
                            {event.date}
                          </span>
                        )}
                      </div>
                      <span className={styles.eventCount}>
                        {event.photoCount}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* GRID – Fotos */}
          <main className={styles.mainContent}>
            {isLoading && (
              <div className={styles.loadingBox}>
                A carregar fotos…
              </div>
            )}

            {!isLoading && !hasError && filteredPhotos.length === 0 && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🏃‍♂️</div>
                <h3 className={styles.emptyTitle}>Nenhuma foto neste evento</h3>
                <p className={styles.emptyText}>
                  Seleciona outro evento na sidebar ou vê todas as fotos.
                </p>
              </div>
            )}

            {!isLoading && !hasError && filteredPhotos.length > 0 && (
              <div className={styles.photoGrid}>
                {filteredPhotos.map((photo, index) => (
                  <Reveal key={photo.id} delay={index * 0.04}>
                    <button
                      type="button"
                      className={styles.photoCard}
                      onClick={() => setSelectedImage(photo)}
                    >
                      <div className={styles.photoImage}>
                        <Image
                          src={photo.src}
                          alt={photo.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className={styles.photoImg}
                        />
                      </div>

                      <div className={styles.photoInfo}>
                        <h3 className={styles.photoTitle}>{photo.title}</h3>
                        <div className={styles.photoMeta}>
                          {photo.date && <span>📅 {photo.date}</span>}
                          {photo.location && (
                            <>
                              <span>•</span>
                              <span>📍 {photo.location}</span>
                            </>
                          )}
                        </div>
                        {selectedEvent === "all" && (
                          <div className={styles.photoEventBadge}>
                            🏃 {photo.eventName}
                          </div>
                        )}
                        {photo.description && (
                          <p className={styles.photoDescription}>
                            {photo.description}
                          </p>
                        )}
                      </div>
                    </button>
                  </Reveal>
                ))}
              </div>
            )}

            {/* Links sociais */}
            <div className={styles.socialLinks}>
              <a
                href="https://instagram.com/joaofaquino"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.socialButton} ${styles.socialButtonInstagram}`}
              >
                📸 Instagram
              </a>

              <a
                href="https://connect.garmin.com/modern/profile/cde13d26-25ea-450f-b96d-7018d1abf598"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.socialButton} ${styles.socialButtonGarmin}`}
              >
                <span>🏃 Ver treinos no Garmin</span>
              </a>
            </div>
          </main>
        </div>
      </div>

      {/* MODAL – imagem cheia (por enquanto placeholder) */}
      {selectedImage && (
        <dialog
          className={styles.modal}
          open
          onCancel={() => setSelectedImage(null)}
          onClose={() => setSelectedImage(null)}
        >
          <div className={styles.modalContent}>
            <div className={styles.modalImageWrapper}>
              <Image
                src={selectedImage.src}
                alt={selectedImage.title}
                fill
                sizes="(max-width: 1024px) 100vw, 70vw"
                className={styles.modalImage}
              />
            </div>
            <p className={styles.modalCaption}>{selectedImage.title}</p>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setSelectedImage(null)}
            >
              Fechar
            </button>
          </div>
        </dialog>
      )}
    </PageWrapper>
  );
}