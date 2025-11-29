"use client";

import { useState } from "react";
import styles from "./contato.module.css";
import { Mail, Instagram, Smartphone, Link as LinkIcon, Send, CheckCircle, AlertCircle } from "lucide-react";
import { useTranslation } from "../../components/TranslationProvider";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function ContactPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      // Formspree endpoint - substitua pelo seu ID após criar conta em formspree.io
      const response = await fetch("https://formspree.io/f/xzzeddok", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        // Reset após 5 segundos
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t("contact.title")}</h1>
        <p className={styles.subtitle}>
          {t("contact.subtitle")}
        </p>
      </div>

      <div className={styles.mainContent}>
        {/* Formulário de Contacto */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>{t("contact.form.title")}</h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>{t("contact.form.name")}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder={t("contact.form.namePlaceholder")}
                  className={styles.input}
                  disabled={status === "loading"}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>{t("contact.form.email")}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder={t("contact.form.emailPlaceholder")}
                  className={styles.input}
                  disabled={status === "loading"}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="subject" className={styles.label}>{t("contact.form.subject")}</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className={styles.select}
                disabled={status === "loading"}
              >
                <option value="">{t("contact.form.selectSubject")}</option>
                <option value="Parcerias">{t("contact.form.partnerships")}</option>
                <option value="Dúvidas sobre treino">{t("contact.form.trainingQuestions")}</option>
                <option value="Sugestões">{t("contact.form.suggestions")}</option>
                <option value="Outro">{t("contact.form.other")}</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.label}>{t("contact.form.message")}</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder={t("contact.form.messagePlaceholder")}
                rows={5}
                className={styles.textarea}
                disabled={status === "loading"}
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <>
                  <span className={styles.spinner} />
                  {t("contact.form.sending")}
                </>
              ) : status === "success" ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  {t("contact.form.sent")}
                </>
              ) : status === "error" ? (
                <>
                  <AlertCircle className="w-5 h-5" />
                  {t("contact.form.error")}
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {t("contact.form.send")}
                </>
              )}
            </button>

            {status === "success" && (
              <p className={styles.successMessage}>
                ✅ {t("contact.form.successMessage")}
              </p>
            )}

            {status === "error" && (
              <p className={styles.errorMessage}>
                ❌ {t("contact.form.errorMessage")}
              </p>
            )}
          </form>
        </div>

        {/* Links de Contacto */}
        <div className={styles.linksSection}>
          <h2 className={styles.sectionTitle}>{t("contact.otherWays")}</h2>

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
              <p>{t("contact.viewGarmin")}</p>
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
        </div>
      </div>
    </section>
  );
}
