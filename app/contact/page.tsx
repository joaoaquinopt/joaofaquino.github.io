"use client";

import styles from "./contato.module.css";
import { Mail, Instagram, Smartphone, Link as LinkIcon } from "lucide-react";

export default function ContactPage() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>Contato</h1>
        <p className={styles.subtitle}>
          Fala comigo! Redes sociais e formas de entrar em contato.
        </p>
      </div>

      <div className={styles.grid}>
        {/* EMAIL */}
        <a
          href="mailto:joaomfaquino@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.card}
        >
          <Mail className={styles.icon} />
          <h3>Email</h3>
          <p>joaomfaquino@gmail.com</p>
        </a>

        {/* GARMIN */}
        <a
          href="https://connect.garmin.com/modern/profile/cde13d26-25ea-450f-b96d-7018d1abf598"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.card}
        >
          <Smartphone className={styles.icon} />
          <h3>Garmin</h3>
          <p>Ver treinos no Garmin</p>
        </a>

        {/* INSTAGRAM */}
        <a
          href="https://instagram.com/joaofaquino"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.card}
        >
          <Instagram className={styles.icon} />
          <h3>Instagram</h3>
          <p>@joaofaquino</p>
        </a>

        {/* TIKTOK */}
        <a
          href="https://www.tiktok.com/@joaofaquino"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.card}
        >
          <LinkIcon className={styles.icon} />
          <h3>TikTok</h3>
          <p>@joaofaquino</p>
        </a>

        {/* THREADS */}
        <a
          href="https://www.threads.net/@joaofaquino"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.card}
        >
          <LinkIcon className={styles.icon} />
          <h3>Threads</h3>
          <p>@joaofaquino</p>
        </a>
      </div>
    </section>
  );
}
