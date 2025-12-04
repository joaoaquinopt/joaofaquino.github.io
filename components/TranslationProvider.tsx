"use client";

import { createContext, useContext, useMemo, useState, useCallback } from "react";

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
    "nav.contact": "Contato",
    "nav.links": "Links",

    // Hero Section
    "hero.label": "Road to Marathon 2026",
    "hero.title": "Um pai, marido, ex-fumante, a caminho da primeira maratona em 2026.",
    "hero.subtitle": "Estou a documentar a jornada real até à minha primeira maratona — treinos, insónias, falhas e vitórias.",
    "hero.cta.journey": "Ver jornada",
    "hero.cta.runs": "Ver últimas corridas",
    "hero.meta": "Próxima grande meta:",
    "hero.marathon": "Maratona • Novembro 2026",

    // Journey Section
    "journey.badge": "A jornada",
    "journey.intro": "Sou João Aquino, QA Engineer, pai do Davi, esposo da Maiara, a tentar ser um ex-fumante e corredor amador rumo à maratona de 2026.",
    "journey.text": "Comecei a correr porque o corpo pediu ajuda: insónia crónica, stress, cigarro e falta de energia. A corrida virou tratamento e promessa. Cada quilómetro é um voto de confiança no futuro que estou a construir.",
    "journey.highlight.energy.title": "Nova energia",
    "journey.highlight.energy.desc": "A corrida começou como resposta à insónia e ao stress. Hoje é um dos pilares da rotina.",
    "journey.highlight.discipline.title": "Disciplina imperfeita",
    "journey.highlight.discipline.desc": "Falho, recomeço e sigo. O foco não é ser perfeito, é aparecer vezes suficientes para mudar.",
    "journey.highlight.goal.title": "Meta 2026",
    "journey.highlight.goal.desc": "Cruzar a primeira maratona com o Davi na meta, a lembrar o caminho desde o zero.",
    "journey.highlight.transform.title": "Transformação real",
    "journey.highlight.transform.desc": "Cada quilómetro queimo vícios antigos e construo uma versão mais leve e mais presente de mim.",
    "journey.timeline.title": "Cronologia",
    "journey.timeline.2024jun.title": "Primeiro passo",
    "journey.timeline.2024jun.text": "Começo a correr para lidar com noites em claro, cigarro e falta de energia.",
    "journey.timeline.2024sep.title": "Rotina em construção",
    "journey.timeline.2024sep.text": "Planilha própria, corridas às 7h e primeiras provas de 5 km completadas.",
    "journey.timeline.2024nov.title": "Treinos estruturados",
    "journey.timeline.2024nov.text": "Blocos em Z2/Z3, velocidade e a decisão: Maratona em 2026.",
    "journey.timeline.2025.title": "Partilha pública",
    "journey.timeline.2025.text": "Dashboard, dados Garmin e a jornada aberta nas redes — para criar responsabilidade.",
    "journey.quote": "Nem sempre perfeito, mas sempre em frente.",

    // Stats Overview
    "stats.totalRuns": "Total de Corridas",
    "stats.totalDistance": "Distância Total",
    "stats.totalTime": "Tempo Total",
    "stats.avgPace": "Ritmo Médio",
    "stats.thisWeek": "Esta Semana",
    "stats.runs": "corridas",
    "stats.km": "km",
    "stats.minPerKm": "min/km",
    "stats.weeklyGoal": "Meta Semanal",
    "stats.allKilometers": "Todos os quilómetros",
    "stats.accumulated": "Acumulados em",
    "stats.training": "treino",
    "stats.registered": "registado",
    "stats.avgPerTraining": "Média por treino:",
    "stats.planInProgress": "Plano em execução",
    "stats.run": "corrida",
    "stats.goal": "Meta",
    "stats.goalReached": "✓ Meta atingida!",
    "stats.remaining": "Faltam",
    "stats.volumeBuilt": "Volume construído",
    "stats.completedTrainings": "treinos concluídos",
    "stats.hoursInvested": "Horas investidas",
    "stats.accumulatedTraining": "acumulado em treino",
    "stats.avgPaceTitle": "Ritmo Médio",
    "stats.trainingRhythm": "Ritmo de treino",
    "stats.perKm": "por km",
    "stats.minKmConsistency": "min/km de consistência",

    // Latest Run Card
    "latestRun.title": "Última Corrida",
    "latestRun.subtitle": "Treino mais recente registado",
    "latestRun.loading": "A carregar...",
    "latestRun.distance": "Distância",
    "latestRun.time": "Tempo",
    "latestRun.pace": "Ritmo",
    "latestRun.calories": "Calorias",
    "latestRun.heartRate": "FC Média",
    "latestRun.avgHr": "FC Média",
    "latestRun.noData": "Sem dados de corrida",

    // Progress Dashboard
    "progress.title": "Dashboard de Progresso",
    "progress.subtitle": "Acompanhamento rumo à Maratona 2026",
    "progress.lastUpdate": "Última atualização",
    "progress.loading": "Carregando dashboard...",
    "progress.noData": "Dashboard sem dados",
    "progress.importData": "Importe os dados CSV do Garmin Connect",
    "progress.totalRuns": "Total de Corridas",
    "progress.activitiesRecorded": "atividades registadas",
    "progress.totalDistance": "Distância Total",
    "progress.accumulatedTraining": "acumulados em treinos",
    "progress.totalTime": "Tempo Acumulado",
    "progress.totalTrainingTime": "tempo total de treino",
    "progress.avgPace": "Ritmo Médio",
    "progress.minPerKm": "minutos por km",
    "progress.filterBy": "Filtrar por período:",
    "progress.currentMonth": "Mês Atual",
    "progress.allMonths": "Todos os Meses",
    "progress.distanceByRun": "Distância por Treino",
    "progress.distanceByMonth": "Distância por Mês",
    "progress.runsIn": "corridas",
    "progress.totalDistanceByMonth": "Distância total por mês",
    "progress.training": "Treino",
    "progress.month": "Mês",
    "progress.goal2026": "Meta 2026",
    "progress.daysRemaining": "dias restantes para a maratona",
    "progress.runHistory": "Histórico de Corridas",
    "progress.activitiesRegistered": "atividades registadas",
    "progress.viewAll": "Ver todas",
    "progress.date": "Data",
    "progress.avgHr": "FC Média",
    "progress.ofMarathon": "da maratona",
    "progress.goal.title": "Meta 2026",
    "progress.goal.daysRemaining": "dias restantes para a maratona",
    "progress.history.title": "Histórico de Corridas",
    "progress.history.activitiesRegistered": "atividades registadas",
    "progress.history.activities": "atividades",
    "progress.history.thisMonth": "este mês",
    "progress.history.viewAll": "Ver todas",
    "progress.history.date": "Data",
    "progress.history.distance": "Distância",
    "progress.history.time": "Tempo",
    "progress.history.avgHr": "FC Média",
    "progress.history.calories": "Calorias",
    "progress.chart.in": "em",

    // Equipment
    "equipment.title": "Equipamento Pessoal",
    "equipment.subtitle": "Ferramentas que uso no caminho até à maratona",
    "equipment.badge": "🚧 Em Construção",
    "equipment.text": "Em breve - secção de equipamentos e parceiros em construção.",
    "equipment.subtext": "Parcerias com marcas e lojas especializadas a caminho!",
    "equipment.myGear": "O Meu Equipamento",
    "equipment.myGearSubtitle": "O que uso nos treinos e provas",
    "equipment.watches": "Relógios",
    "equipment.shoes": "Ténis",
    "equipment.clothing": "Vestuário",
    "equipment.accessories": "Acessórios",
    "equipment.status.inUse": "Em uso",
    "equipment.status.main": "Principal",
    "equipment.status.essential": "Essencial",
    "equipment.itemSingular": "item",
    "equipment.itemPlural": "items",
    "equipment.viewProduct": "Ver produto",
    "equipment.affiliates.title": "Recomendados",
    "equipment.affiliates.subtitle": "Produtos testados ou em avaliação com links de afiliado. Escolhe a região que faz sentido para ti e apoia o projeto!",
    "equipment.affiliates.region.pt": "Portugal / Europa",
    "equipment.affiliates.region.br": "Brasil",
    "equipment.affiliates.noMatches": "Nenhum produto corresponde aos filtros desta região.",
    "equipment.affiliates.emptyRegion": "Em breve adiciono recomendações para esta região.",
    "equipment.affiliates.linkSoon": "Link disponível em breve",
    "equipment.affiliates.partnerLabel": "Parceiro",
    "equipment.partners.title": "Parceiros & Afiliados",
    "equipment.partners.subtitle": "Lojas e marcas parceiras onde encontro os melhores produtos para treino. Apoie o projeto usando os links abaixo! 🙏",
    "equipment.viewProducts": "Ver Produtos",
    "equipment.products": "produto(s) recomendado(s)",
    "equipment.howItWorks": "Como Funciona?",
    "equipment.howItWorksText": "Quando compras através dos meus links de afiliado, ajudas a manter este projeto ativo sem qualquer custo extra para ti. Recomendo apenas produtos que uso ou confio!",
    "equipment.disclaimer": "⚠️ Os links podem conter códigos de afiliado. Ao comprar através deles, posso receber uma pequena comissão, sem custo adicional para ti.",

    // Gallery
    "gallery.title": "Galeria",
    "gallery.subtitle": "Momentos registados ao longo da preparação para a maratona de 2026. Cada foto conta uma história, cada treino é uma conquista.",
    "gallery.events": "Eventos",
    "gallery.allPhotos": "Todas as fotos",
    "gallery.since": "Desde 2025",
    "gallery.since2025": "Desde 2025",
    "gallery.loading": "A carregar eventos…",
    "gallery.error": "Não foi possível carregar a galeria.",
    "gallery.loadingEvents": "A carregar eventos…",
    "gallery.loadError": "Não foi possível carregar a galeria.",
    "gallery.noPhotos": "Nenhuma foto neste evento",
    "gallery.selectOther": "Seleciona outro evento na sidebar ou vê todas as fotos.",
    "gallery.loadingPhotos": "A carregar fotos…",
    "gallery.close": "Fechar",

    // Contact
    "contact.title": "Contacto",
    "contact.subtitle": "Fala comigo! Envia uma mensagem ou conecta-te pelas redes sociais.",
    "contact.formTitle": "Envia uma mensagem",
    "contact.form.title": "Envia uma mensagem",
    "contact.name": "Nome",
    "contact.form.name": "Nome",
    "contact.namePlaceholder": "O teu nome",
    "contact.form.namePlaceholder": "O teu nome",
    "contact.email": "Email",
    "contact.form.email": "Email",
    "contact.emailPlaceholder": "email@exemplo.com",
    "contact.form.emailPlaceholder": "email@exemplo.com",
    "contact.subject": "Assunto",
    "contact.form.subject": "Assunto",
    "contact.selectSubject": "Seleciona um assunto",
    "contact.form.selectSubject": "Seleciona um assunto",
    "contact.partnerships": "Parcerias",
    "contact.form.partnerships": "Parcerias",
    "contact.trainingQuestions": "Dúvidas sobre treino",
    "contact.form.trainingQuestions": "Dúvidas sobre treino",
    "contact.suggestions": "Sugestões",
    "contact.form.suggestions": "Sugestões",
    "contact.other": "Outro",
    "contact.form.other": "Outro",
    "contact.message": "Mensagem",
    "contact.form.message": "Mensagem",
    "contact.messagePlaceholder": "Escreve a tua mensagem aqui...",
    "contact.form.messagePlaceholder": "Escreve a tua mensagem aqui...",
    "contact.send": "Enviar mensagem",
    "contact.form.send": "Enviar mensagem",
    "contact.sending": "A enviar...",
    "contact.form.sending": "A enviar...",
    "contact.sent": "Mensagem enviada!",
    "contact.form.sent": "Mensagem enviada!",
    "contact.error": "Erro ao enviar",
    "contact.form.error": "Erro ao enviar",
    "contact.successMessage": "Obrigado pela mensagem! Vou responder assim que possível.",
    "contact.form.successMessage": "Obrigado pela mensagem! Vou responder assim que possível.",
    "contact.errorMessage": "Ocorreu um erro. Tenta novamente ou contacta-me diretamente por email.",
    "contact.form.errorMessage": "Ocorreu um erro. Tenta novamente ou contacta-me diretamente por email.",
    "contact.otherWays": "Outras formas de contacto",
    "contact.viewTraining": "Ver treinos no Garmin",
    "contact.viewGarmin": "Ver treinos no Garmin",

    // CTA Section
    "cta.title": "Acompanha a Jornada",
    "cta.subtitle": "Segue a evolução nas redes sociais e faz parte desta história rumo à maratona de 2026.",
    "cta.instagram": "Seguir no Instagram",
    "cta.garmin": "Ver Treinos no Garmin",
    "cta.progress": "Ver Dashboard",

    // Footer
    "footer.rights": "Todos os direitos reservados.",
    "footer.madeWith": "Feito com",
    "footer.and": "e",
    "footer.privacy": "Privacidade",
    "footer.copyright": " João Aquino. Todos os direitos reservados.",

    // Common
    "common.roadToMarathon": "Road to Marathon 2026",
    "common.viewMore": "Ver mais",
    "common.close": "Fechar",
  },
  en: {
    // Header
    "nav.journey": "Journey",
    "nav.progress": "Progress",
    "nav.equipment": "Equipment & Partners",
    "nav.gallery": "Gallery",
    "nav.contact": "Contact",
    "nav.links": "Links",

    // Hero Section
    "hero.label": "Road to Marathon 2026",
    "hero.title": "A father, a former smoker, on the way to my first marathon in 2026.",
    "hero.subtitle": "I'm documenting the real journey to my first marathon — training, sleepless nights, failures and victories.",
    "hero.cta.journey": "See journey",
    "hero.cta.runs": "See latest runs",
    "hero.meta": "Next big goal:",
    "hero.marathon": "Marathon • November 2026",

    // Journey Section
    "journey.badge": "The journey",
    "journey.intro": "I'm João Aquino, QA Engineer, Davi's father, trying to be a former smoker and amateur runner on my way to the 2026 marathon.",
    "journey.text": "I started running because my body asked for help: chronic insomnia, stress, cigarettes and lack of energy. Running became treatment and promise. Every kilometer is a vote of confidence in the future I'm building.",
    "journey.highlight.energy.title": "New energy",
    "journey.highlight.energy.desc": "Running started as a response to insomnia and stress. Today it's one of the pillars of my routine.",
    "journey.highlight.discipline.title": "Imperfect discipline",
    "journey.highlight.discipline.desc": "I fail, restart and keep going. The focus isn't being perfect, it's showing up enough times to change.",
    "journey.highlight.goal.title": "Goal 2026",
    "journey.highlight.goal.desc": "Cross my first marathon with Davi at the finish line, remembering the path from zero.",
    "journey.highlight.transform.title": "Real transformation",
    "journey.highlight.transform.desc": "Every kilometer I burn old vices and build a lighter, more present version of myself.",
    "journey.timeline.title": "Timeline",
    "journey.timeline.2024jun.title": "First step",
    "journey.timeline.2024jun.text": "Started running to deal with sleepless nights, cigarettes and lack of energy.",
    "journey.timeline.2024sep.title": "Building routine",
    "journey.timeline.2024sep.text": "Own training plan, 7am runs and first 5K races completed.",
    "journey.timeline.2024nov.title": "Structured training",
    "journey.timeline.2024nov.text": "Z2/Z3 blocks, speed work and the decision: Marathon in 2026.",
    "journey.timeline.2025.title": "Public sharing",
    "journey.timeline.2025.text": "Dashboard, Garmin data and the journey open on social media — to create accountability.",
    "journey.quote": "Not always perfect, but always moving forward.",

    // Stats Overview
    "stats.totalRuns": "Total Runs",
    "stats.totalDistance": "Total Distance",
    "stats.totalTime": "Total Time",
    "stats.avgPace": "Average Pace",
    "stats.thisWeek": "This Week",
    "stats.runs": "runs",
    "stats.km": "km",
    "stats.minPerKm": "min/km",
    "stats.weeklyGoal": "Weekly Goal",
    "stats.allKilometers": "All kilometers",
    "stats.accumulated": "Accumulated in",
    "stats.training": "training",
    "stats.registered": "registered",
    "stats.avgPerTraining": "Avg per training:",
    "stats.planInProgress": "Plan in progress",
    "stats.run": "run",
    "stats.goal": "Goal",
    "stats.goalReached": "✓ Goal reached!",
    "stats.remaining": "Remaining",
    "stats.volumeBuilt": "Volume built",
    "stats.completedTrainings": "completed trainings",
    "stats.hoursInvested": "Hours invested",
    "stats.accumulatedTraining": "accumulated in training",
    "stats.avgPaceTitle": "Average Pace",
    "stats.trainingRhythm": "Training rhythm",
    "stats.perKm": "per km",
    "stats.minKmConsistency": "min/km consistency",

    // Latest Run Card
    "latestRun.title": "Latest Run",
    "latestRun.subtitle": "Most recent training recorded",
    "latestRun.loading": "Loading...",
    "latestRun.distance": "Distance",
    "latestRun.time": "Time",
    "latestRun.pace": "Pace",
    "latestRun.calories": "Calories",
    "latestRun.heartRate": "Avg HR",
    "latestRun.avgHr": "Avg HR",
    "latestRun.noData": "No run data",

    // Progress Dashboard
    "progress.title": "Progress Dashboard",
    "progress.subtitle": "Tracking towards Marathon 2026",
    "progress.lastUpdate": "Last update",
    "progress.loading": "Loading dashboard...",
    "progress.noData": "Dashboard without data",
    "progress.importData": "Import CSV data from Garmin Connect",
    "progress.totalRuns": "Total Runs",
    "progress.activitiesRecorded": "activities recorded",
    "progress.totalDistance": "Total Distance",
    "progress.accumulatedTraining": "accumulated in training",
    "progress.totalTime": "Total Time",
    "progress.totalTrainingTime": "total training time",
    "progress.avgPace": "Average Pace",
    "progress.minPerKm": "minutes per km",
    "progress.filterBy": "Filter by period:",
    "progress.currentMonth": "Current Month",
    "progress.allMonths": "All Months",
    "progress.distanceByRun": "Distance by Run",
    "progress.distanceByMonth": "Distance by Month",
    "progress.runsIn": "runs",
    "progress.totalDistanceByMonth": "Total distance by month",
    "progress.training": "Training",
    "progress.month": "Month",
    "progress.goal2026": "Goal 2026",
    "progress.daysRemaining": "days remaining to marathon",
    "progress.runHistory": "Run History",
    "progress.activitiesRegistered": "activities registered",
    "progress.viewAll": "View all",
    "progress.date": "Date",
    "progress.avgHr": "Avg HR",
    "progress.ofMarathon": "of marathon",
    "progress.goal.title": "Goal 2026",
    "progress.goal.daysRemaining": "days remaining to marathon",
    "progress.history.title": "Run History",
    "progress.history.activitiesRegistered": "activities registered",
    "progress.history.activities": "activities",
    "progress.history.thisMonth": "this month",
    "progress.history.viewAll": "View all",
    "progress.history.date": "Date",
    "progress.history.distance": "Distance",
    "progress.history.time": "Time",
    "progress.history.avgHr": "Avg HR",
    "progress.history.calories": "Calories",
    "progress.chart.in": "in",

    // Equipment
    "equipment.title": "Personal Equipment",
    "equipment.subtitle": "Tools I use on the path to the marathon",
    "equipment.badge": "🚧 Under Construction",
    "equipment.text": "Coming soon - equipment and partners section is under construction.",
    "equipment.subtext": "Partnerships with brands and specialized stores coming soon!",
    "equipment.myGear": "My Gear",
    "equipment.myGearSubtitle": "What I use for training and races",
    "equipment.watches": "Watches",
    "equipment.shoes": "Shoes",
    "equipment.clothing": "Clothing",
    "equipment.accessories": "Accessories",
    "equipment.status.inUse": "In use",
    "equipment.status.main": "Main",
    "equipment.status.essential": "Essential",
    "equipment.itemSingular": "item",
    "equipment.itemPlural": "items",
    "equipment.viewProduct": "View product",
    "equipment.affiliates.title": "Recommended",
    "equipment.affiliates.subtitle": "Curated affiliate picks by region. Choose your store, support the project and keep the journey moving!",
    "equipment.affiliates.region.pt": "Portugal / EU",
    "equipment.affiliates.region.br": "Brazil",
    "equipment.affiliates.noMatches": "No products match the current filters for this region.",
    "equipment.affiliates.emptyRegion": "Coming soon — curated picks for this region.",
    "equipment.affiliates.linkSoon": "Link coming soon",
    "equipment.affiliates.partnerLabel": "Partner",
    "equipment.partners.title": "Partners & Affiliates",
    "equipment.partners.subtitle": "Partner stores where I find the best training products. Support the project using the links below! 🙏",
    "equipment.viewProducts": "View Products",
    "equipment.products": "recommended product(s)",
    "equipment.howItWorks": "How Does It Work?",
    "equipment.howItWorksText": "When you purchase through my affiliate links, you help keep this project active at no extra cost to you. I only recommend products I use or trust!",
    "equipment.disclaimer": "⚠️ Links may contain affiliate codes. By purchasing through them, I may receive a small commission at no additional cost to you.",

    // Gallery
    "gallery.title": "Gallery",
    "gallery.subtitle": "Moments captured during the preparation for the 2026 marathon. Each photo tells a story, each training is a conquest.",
    "gallery.events": "Events",
    "gallery.allPhotos": "All photos",
    "gallery.since": "Since 2025",
    "gallery.since2025": "Since 2025",
    "gallery.loading": "Loading events…",
    "gallery.error": "Could not load gallery.",
    "gallery.loadingEvents": "Loading events…",
    "gallery.loadError": "Could not load gallery.",
    "gallery.noPhotos": "No photos in this event",
    "gallery.selectOther": "Select another event in the sidebar or see all photos.",
    "gallery.loadingPhotos": "Loading photos…",
    "gallery.close": "Close",

    // Contact
    "contact.title": "Contact",
    "contact.subtitle": "Talk to me! Send a message or connect through social media.",
    "contact.formTitle": "Send a message",
    "contact.form.title": "Send a message",
    "contact.name": "Name",
    "contact.form.name": "Name",
    "contact.namePlaceholder": "Your name",
    "contact.form.namePlaceholder": "Your name",
    "contact.email": "Email",
    "contact.form.email": "Email",
    "contact.emailPlaceholder": "email@example.com",
    "contact.form.emailPlaceholder": "email@example.com",
    "contact.subject": "Subject",
    "contact.form.subject": "Subject",
    "contact.selectSubject": "Select a subject",
    "contact.form.selectSubject": "Select a subject",
    "contact.partnerships": "Partnerships",
    "contact.form.partnerships": "Partnerships",
    "contact.trainingQuestions": "Training questions",
    "contact.form.trainingQuestions": "Training questions",
    "contact.suggestions": "Suggestions",
    "contact.form.suggestions": "Suggestions",
    "contact.other": "Other",
    "contact.form.other": "Other",
    "contact.message": "Message",
    "contact.form.message": "Message",
    "contact.messagePlaceholder": "Write your message here...",
    "contact.form.messagePlaceholder": "Write your message here...",
    "contact.send": "Send message",
    "contact.form.send": "Send message",
    "contact.sending": "Sending...",
    "contact.form.sending": "Sending...",
    "contact.sent": "Message sent!",
    "contact.form.sent": "Message sent!",
    "contact.error": "Error sending",
    "contact.form.error": "Error sending",
    "contact.successMessage": "Thank you for the message! I'll reply as soon as possible.",
    "contact.form.successMessage": "Thank you for the message! I'll reply as soon as possible.",
    "contact.errorMessage": "An error occurred. Try again or contact me directly by email.",
    "contact.form.errorMessage": "An error occurred. Try again or contact me directly by email.",
    "contact.otherWays": "Other ways to contact",
    "contact.viewTraining": "View training on Garmin",
    "contact.viewGarmin": "View training on Garmin",

    // CTA Section
    "cta.title": "Follow the Journey",
    "cta.subtitle": "Follow the evolution on social media and be part of this story towards the 2026 marathon.",
    "cta.instagram": "Follow on Instagram",
    "cta.garmin": "View Training on Garmin",
    "cta.progress": "View Dashboard",

    // Footer
    "footer.rights": "All rights reserved.",
    "footer.madeWith": "Made with",
    "footer.and": "and",
    "footer.privacy": "Privacy",
    "footer.copyright": "© 2025 João Aquino. All rights reserved.",

    // Common
    "common.roadToMarathon": "Road to Marathon 2026",
    "common.viewMore": "View more",
    "common.close": "Close",
  },
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (!("window" in globalThis) || !globalThis.window) {
      return "pt";
    }

    const savedLang = globalThis.window.localStorage.getItem("language") as Language | null;
    if (savedLang && (savedLang === "pt" || savedLang === "en")) {
      return savedLang;
    }

    return "pt";
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if ("window" in globalThis && globalThis.window) {
      globalThis.window.localStorage.setItem("language", lang);
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translations[language][key as keyof typeof translations.pt] || key;
    },
    [language]
  );

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, setLanguage, t]
  );

  return (
    <TranslationContext.Provider value={contextValue}>
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
