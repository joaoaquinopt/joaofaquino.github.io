# 🏃‍♂️ joaofaquino.run

> **Road to Marathon 2026** — A jornada real de João Aquino, documentada com dados de treino, design minimalista e automação.

[![Deploy Status](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://joaofaquino.run)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Strava](https://img.shields.io/badge/Strava-API-orange?logo=strava)](https://developers.strava.com/)

---

## 🎯 Sobre o Projeto

**joaofaquino.run** é um site pessoal que documenta minha preparação para a **Maratona de 2026**, integrando:

- ✅ Dados reais do Strava (API v3)
- ✅ Design minimalista com animações suaves (Framer Motion)
- ✅ Modo Dark/Light com persistência
- ✅ Automação via GitHub Actions
- ✅ Dashboards dinâmicos de progresso

---

## 🚀 Stack Tecnológica

| Tecnologia | Função |
|------------|--------|
| **Next.js 14** (App Router) | Framework React com SSR/ISR |
| **TypeScript** | Tipagem estática e código escalável |
| **TailwindCSS** | Estilos utilitários e design responsivo |
| **Framer Motion** | Animações e transições |
| **next-themes** | Dark/Light mode com persistência |
| **Strava API** | Integração de dados de treino |
| **Python 3.11** | Scripts de automação |
| **Vercel** | Hospedagem e CI/CD |

---

## 📦 Instalação e Configuração

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/joaoaquinopt/joaofaquino.github.io.git
cd joaofaquino.github.io
```

### 2️⃣ Instale as dependências

```bash
npm install
```

### 3️⃣ Configure as variáveis de ambiente

Copie o ficheiro de exemplo e preencha com suas credenciais do Strava:

```bash
cp .env.local.example .env.local
```

Edite `.env.local`:

```env
STRAVA_CLIENT_ID=your_client_id
STRAVA_CLIENT_SECRET=your_client_secret
STRAVA_REFRESH_TOKEN=your_refresh_token
STRAVA_REDIRECT_URI=http://localhost
```

> 💡 Obtenha suas credenciais em: https://www.strava.com/settings/api

### 4️⃣ Execute o servidor de desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🐍 Scripts Python (Automação)

### Fetch de dados do Strava

```bash
cd scripts
pip install -r requirements.txt
python fetch_strava_data.py
```

Isto irá:
- ✅ Autenticar com a API do Strava
- ✅ Buscar as últimas 10 atividades
- ✅ Salvar em `public/data/strava_summary.json`

### Gerar SVG cards

```bash
python generate_svg_cards.py
```

Isto irá:
- ✅ Ler `strava_summary.json`
- ✅ Gerar um SVG card da última corrida
- ✅ Salvar em `public/cards/last_activity.svg`

---

## 🤖 Automação com GitHub Actions

O workflow `.github/workflows/update_strava.yml` executa **diariamente às 12h UTC**:

1. Faz fetch dos dados do Strava
2. Gera SVG cards
3. Commita as alterações automaticamente

### Configurar Secrets no GitHub

Vá em **Settings → Secrets and variables → Actions** e adicione:

- `STRAVA_CLIENT_ID`
- `STRAVA_CLIENT_SECRET`
- `STRAVA_REFRESH_TOKEN`

---

## 📂 Estrutura do Projeto

```
joaofaquino.run/
├── app/
│   ├── layout.tsx              # Layout global com ThemeProvider
│   ├── page.tsx                # Página principal (Jornada)
│   ├── progresso/page.tsx      # Dashboard de progresso com Strava
│   ├── equipamentos/page.tsx   # Parceiros e equipamentos
│   ├── contacto/page.tsx       # Informações de contacto
│   └── api/strava/route.ts     # API route para dados do Strava
├── components/
│   ├── Header.tsx              # Navegação + ThemeToggle
│   ├── Footer.tsx              # Rodapé com links sociais
│   ├── PageWrapper.tsx         # Wrapper de animação de páginas
│   ├── Reveal.tsx              # Fade/slide on scroll
│   ├── MotionCard.tsx          # Cards interativos
│   ├── ThemeProvider.tsx       # Provider do next-themes
│   └── ThemeToggle.tsx         # Botão de toggle dark/light
├── public/
│   ├── data/
│   │   └── strava_summary.json # Dados do Strava
│   └── cards/
│       └── last_activity.svg   # SVG gerado automaticamente
├── scripts/
│   ├── fetch_strava_data.py    # Fetch da API do Strava
│   ├── generate_svg_cards.py   # Geração de SVG cards
│   └── requirements.txt        # Dependências Python
└── .env.local.example          # Template de configuração
```

---

## 🎨 Design System

### Paleta de Cores (Dark Mode)

```css
--primary:   #0A2342  /* Azul escuro profundo */
--secondary: #1E4D8B  /* Azul médio */
--accent:    #58A6FF  /* Azul claro (destaques) */
--light:     #ECECEC  /* Branco suave */
```

### Paleta de Cores (Light Mode)

```css
--primary:   #f0f7ff  /* Azul muito claro */
--secondary: #dbeafe  /* Azul pastel */
--accent:    #3b82f6  /* Azul vibrante */
--light:     #1e293b  /* Cinza escuro */
```

### Tipografia

- **Títulos**: `Montserrat`, bold
- **Corpo**: `Inter`, regular
- **Destaque**: `Open Sans`, semibold

---

## 🌐 Deploy

### Vercel (Recomendado)

1. Push para GitHub
2. Importe o projeto na Vercel
3. Configure as variáveis de ambiente
4. Deploy automático a cada push

### Build manual

```bash
npm run build
npm run start
```

---

## 🗺️ Roadmap

### ✅ Fase 1 — Base
- [x] Migração para Next.js 14
- [x] Setup TailwindCSS
- [x] Deploy na Vercel

### ✅ Fase 2 — SPA e Animações
- [x] AnimatePresence e PageWrapper
- [x] Componentes Reveal e MotionCard
- [x] Rotas dinâmicas

### ✅ Fase 3 — Features Avançadas
- [x] Integração Strava API
- [x] Dashboard de Progresso
- [x] Dark/Light Mode
- [x] API Routes

### 🚧 Fase 4 — Expansão (Próximo)
- [ ] Gráficos de evolução (Chart.js ou D3.js)
- [ ] Galeria de corridas
- [ ] Integração Garmin Connect
- [ ] Sistema de afiliados

---

## 🤝 Contribuições

Este é um projeto pessoal, mas sugestões são bem-vindas!

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'Add amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o ficheiro [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**João Aquino**  
QA Engineer & Marathon Runner

- 🌐 [joaofaquino.run](https://joaofaquino.run)
- 📸 Instagram: [@joaofaquino](https://instagram.com/joaofaquino)
- 💼 GitHub: [@joaoaquinopt](https://github.com/joaoaquinopt)
- 📧 Email: joaofaquino@gmail.com

---

> *"Nem sempre perfeito, mas sempre em frente."* 🏁
