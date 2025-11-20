"use client";

import { createContext, useContext, useState, useEffect } from "react";

type Language = "pt" | "en";

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  pt: {
    // Header
    "nav.journey": "Jornada",
    "nav.progress": "Progresso",
    "nav.equipment": "Equipamentos & Parceiros",
    "nav.gallery": "Galeria",
    "nav.contact": "Contacto",

    // Home
    "home.title": "A Jornada",
    "home.intro": "Sou João Aquino, QA Engineer e corredor amador.",
    "home.description": "Este espaço documenta o meu caminho até à maratona de 2026 — com dados reais, desafios, noites sem sono e muita persistência.",
    "home.quote": "Nem sempre perfeito, mas sempre em frente.",

    // Progress
    "progress.title": "Progresso de Treino",
    "progress.description": "Acompanha a minha evolução rumo à Maratona 2026",
    "progress.tabs.activities": "Atividades",
    "progress.tabs.dashboard": "Dashboard",
    "progress.stats.distance": "Distância Total",
    "progress.stats.time": "Tempo Total",
    "progress.stats.avgPace": "Pace Médio",
    "progress.stats.runs": "Corridas",
    "progress.run": "Corrida",
    "progress.distance": "Distância",
    "progress.time": "Tempo",
    "progress.pace": "Pace",
    "progress.marathon": "da maratona",
    "progress.loading": "A carregar dados de treino...",

    // Equipment
    "equipment.title": "Equipamento Pessoal",
    "equipment.description": "Ferramentas que uso no caminho até à maratona",
    "equipment.watches": "Relógios",
    "equipment.shoes": "Ténis",
    "equipment.clothing": "Vestuário",
    "equipment.accessories": "Acessórios",
    "equipment.status.inUse": "Em uso",
    "equipment.status.main": "Principal",
    "equipment.status.essential": "Essencial",

    // Affiliates
    "affiliates.title": "Parceiros & Afiliados",
    "affiliates.description": "Lojas e marcas parceiras onde encontro os melhores produtos para treino. Apoie o projeto usando os links abaixo! 🙏",
    "affiliates.viewProducts": "Ver Produtos",
    "affiliates.products": "produto(s) recomendado(s)",
    "affiliates.howItWorks": "Como Funciona?",
    "affiliates.howItWorksText": "Quando compras através dos meus links de afiliado, ajudas a manter este projeto ativo sem qualquer custo extra para ti. Recomendo apenas produtos que uso ou confio!",
    "affiliates.disclaimer": "⚠️ Os links podem conter códigos de afiliado. Ao comprar através deles, posso receber uma pequena comissão, sem custo adicional para ti.",

    // Contact
    "contact.title": "Vamos Conectar",
    "contact.description": "Segue a jornada nas redes sociais ou envia uma mensagem",
    "contact.email": "Enviar Email",

    // Gallery
    "gallery.title": "Galeria de Corridas",
    "gallery.description": "Momentos capturados ao longo da jornada",
    "gallery.comingSoon": "Em breve...",

    // Common
    "common.roadToMarathon": "Road to Marathon 2026",
  },
  en: {
    // Header
    "nav.journey": "Journey",
    "nav.progress": "Progress",
    "nav.equipment": "Equipment & Partners",
    "nav.gallery": "Gallery",
    "nav.contact": "Contact",

    // Home
    "home.title": "The Journey",
    "home.intro": "I'm João Aquino, QA Engineer and amateur runner.",
    "home.description": "This space documents my path to the 2026 marathon — with real data, challenges, sleepless nights and a lot of persistence.",
    "home.quote": "Not always perfect, but always moving forward.",

    // Progress
    "progress.title": "Training Progress",
    "progress.description": "Follow my evolution towards Marathon 2026",
    "progress.tabs.activities": "Activities",
    "progress.tabs.dashboard": "Dashboard",
    "progress.stats.distance": "Total Distance",
    "progress.stats.time": "Total Time",
    "progress.stats.avgPace": "Avg Pace",
    "progress.stats.runs": "Runs",
    "progress.run": "Run",
    "progress.distance": "Distance",
    "progress.time": "Time",
    "progress.pace": "Pace",
    "progress.marathon": "of marathon",
    "progress.loading": "Loading training data...",

    // Equipment
    "equipment.title": "Personal Equipment",
    "equipment.description": "Tools I use on the path to the marathon",
    "equipment.watches": "Watches",
    "equipment.shoes": "Shoes",
    "equipment.clothing": "Clothing",
    "equipment.accessories": "Accessories",
    "equipment.status.inUse": "In use",
    "equipment.status.main": "Main",
    "equipment.status.essential": "Essential",

    // Affiliates
    "affiliates.title": "Partners & Affiliates",
    "affiliates.description": "Partner stores where I find the best training products. Support the project using the links below! 🙏",
    "affiliates.viewProducts": "View Products",
    "affiliates.products": "recommended product(s)",
    "affiliates.howItWorks": "How Does It Work?",
    "affiliates.howItWorksText": "When you purchase through my affiliate links, you help keep this project active at no extra cost to you. I only recommend products I use or trust!",
    "affiliates.disclaimer": "⚠️ Links may contain affiliate codes. By purchasing through them, I may receive a small commission at no additional cost to you.",

    // Contact
    "contact.title": "Let's Connect",
    "contact.description": "Follow the journey on social media or send a message",
    "contact.email": "Send Email",

    // Gallery
    "gallery.title": "Running Gallery",
    "gallery.description": "Moments captured along the journey",
    "gallery.comingSoon": "Coming soon...",

    // Common
    "common.roadToMarathon": "Road to Marathon 2026",
  },
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("pt");

  useEffect(() => {
    // Load saved language from localStorage
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang && (savedLang === "pt" || savedLang === "en")) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.pt] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within TranslationProvider");
  }
  return context;
}
