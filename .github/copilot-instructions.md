# 🏃‍♂️ Projeto: joaofaquino.run

## 🎯 Visão Geral

**joaofaquino.run** documenta a jornada autêntica de **João Aquino rumo à Maratona de 2026**, combinando narrativa pessoal, dashboards dinâmicos e integração com dados de treino do Garmin Connect. O objetivo é evidenciar consistência, disciplina e evolução com design cuidado e animações suaves.

**Snapshot — 24/11/2025**
- Homepage com hero narrativo, estatísticas quase em tempo real, card da última corrida, secção de jornada e CTA social.
- Dashboard `/progress` com cards de métricas, gráfico interativo (corrida vs mês), countdown para a maratona e tabela de histórico detalhada.
- Galeria filtrável por eventos com modal fullscreen e assets mapeados automaticamente a partir de `public/assets/gallery`.
- Páginas adicionais: equipamentos, contactos, link-in-bio, privacidade.
- Scripts Python e Node para importar CSV/FIT, gerar JSONs, criar backups e manter dados consistentes.

---

## 🧱 Stack & Arquitetura

| Camada | Tecnologia | Destaques |
| ------ | ---------- | --------- |
| Framework | **Next.js 14 (App Router)** | Rotas em `app/`, SSR/ISR, API routes para dados locais. |
| Linguagem | **TypeScript** | Tipagem em componentes, hooks e scripts. |
| UI & Estilos | **TailwindCSS**, **CSS Modules**, `app/globals.css`, `app/theme.css` | Tailwind para utilidades; CSS Modules para responsividade controlada (Header, dashboard, gallery, hero, journey). |
| Animações | **Framer Motion** (`PageWrapper`, `Reveal`, `MotionCard`) | Transições entre rotas via `AnimatePresence`, animações on-scroll e hover. |
| Dados | **Garmin CSV → JSON** (`public/data/garmin_summary.json`) | Processado com scripts Python; consumido por homepage e `/progress`. |
| Galeria | `public/data/gallery_index.json` + assets estáticos | Build script Node e rota API de fallback que lê o filesystem. |
| Hospedagem | **Vercel** | Deploy contínuo, domínio `joaofaquino.run`, `@vercel/speed-insights/next` ligado. |
| Theming | `next-themes` (`ThemeProvider`) | Tema dark por omissão, pronto para toggle persistente. |
| Localização | `TranslationProvider`, `LanguageToggle` | Contexto PT/EN, PT ativo por defeito. |

---

## ⚙️ Estrutura Principal

```
app/
	layout.tsx            # Shell global (Header, Footer, Providers, SpeedInsights)
	page.tsx              # Homepage (Hero + stats + journey + CTA)
	progress/page.tsx     # Dashboard detalhado com gráfico e histórico
	equipment/page.tsx    # Equipamentos e parceiros (layout Nike-style)
	gallery/page.tsx      # Galeria filtrável com modal fullscreen
	contact/page.tsx      # CTA para contacto (PT)
	links/page.tsx        # Link-in-bio estilizado
	privacy/page.tsx      # Política de privacidade
	api/garmin/route.ts   # Exposição do JSON de treino
	api/gallery/route.ts  # Lista eventos com base nos assets
components/
	Header.tsx + .module  # Navbar responsiva (desktop vs hamburguer mobile)
	Footer.tsx            # Links sociais + copy
	HeroSection, JourneySection, StatsOverview, LatestRunCard, CTASection
	HorizontalProgressChart.tsx   # Barchart custom com modos treino/mês
	Motion primitives (`PageWrapper`, `Reveal`, `MotionCard`)
	ThemeProvider.tsx
	TranslationProvider.tsx / LanguageToggle.tsx
scripts/
	process_garmin_data.py         # CSV → JSON normalizado (produção)
	import_garmin_exports.py       # Parser FIT/CSV completo
	import_garmin_incremental.py   # Merge incremental sem perder histórico
	update_training_data.py        # Workflow completo (backup + import + commit)
	backup_data.py                 # Backups com timestamp
	build_gallery_data.js          # Gera `public/data/gallery_index.json`
public/data/
	garmin_summary.json            # Fonte principal de dados
	gallery_index.json             # Metadados da galeria
```

---

## 🧩 Destaques por Página

- **Home (`app/page.tsx`)**: `HeroSection`, `StatsOverview`, `LatestRunCard`, `JourneySection`, `CTASection`. Fetch de `garmin_summary.json` com normalização defensiva.
- **Progress (`/progress`)**: cards métricos, `HorizontalProgressChart` (modos Treino/Mês), card “Meta 2026” com countdown, tabela de histórico.
- **Gallery (`/gallery`)**: sidebar de eventos, grid animado (`Reveal`), modal fullscreen, botões sociais.
- **Equipment (`/equipment`)**: layout Nike-style com `MotionCard` para parceiros.
- **Contact / Links / Privacy**: conteúdo estático em PT (links sociais, política de privacidade).

---

## 🏃‍♂️ Pipeline Garmin

1. Exportar atividades do Garmin Connect para `data/garmin_exports/`.
2. Executar `python scripts/process_garmin_data.py` (ou `update_training_data.py` para o fluxo completo).
	 - Filtra apenas `Running`.
	 - Normaliza datas (`iso_date`, `dd/mm/yyyy`).
	 - Calcula totais, pace médio, progresso maratona, estatísticas semanais.
	 - Escreve `public/data/garmin_summary.json` com `ensure_ascii=False`.
3. Homepage e `/progress` consomem o JSON estático via `/data/...` ou `/api/garmin`.
4. `LatestRunCard` e `StatsOverview` tratam campos opcionais de forma defensiva.
5. `backup_data.py` cria snapshots em `data/backups/garmin_backup_*.json`.
6. `update_training_data.py` orquestra backup → import incremental → `git add/commit/push` → limpeza opcional dos CSVs.

**Campos principais do JSON**
- `stats`: totais (corridas, km, tempo, pace, média por treino, progresso maratona).
- `latest_run`: data, título, distância, tempo, pace, HR, calorias.
- `this_week`: corridas, distância e tempo da última semana.
- `recent_runs`: últimas corridas (usadas em `/progress`).

---

## 🖼️ Pipeline da Galeria

- Assets em `public/assets/gallery/<evento>/<imagem>`.
- `scripts/build_gallery_data.js` gera `public/data/gallery_index.json`.
- `/gallery` faz `fetch` do JSON; rota `/api/gallery` atua como fallback via filesystem.
- Modal fullscreen com `Reveal` e botões sociais (Instagram, Garmin Connect).

---

## 🎨 Sistema Visual & Motion

- Paleta: `#0A2342`, `#1E4D8B`, `#58A6FF`, `#ECECEC` sobre fundo radial escuro.
- CSS Modules dedicados (`Header`, `HeroSection`, `StatsOverview`, `LatestRunCard`, `CTASection`, `JourneySection`, `dashboard`, `gallery`).
- `PageWrapper` fornece `AnimatePresence` para transições; `Reveal` aplica fade/slide on-scroll; `MotionCard` entrega hover 3D leve.
- Glassmorphism, gradientes e tipografia bold compõem a identidade visual.

---

## 🌗 Tema & Localização

- `ThemeProvider` (`next-themes`) configurado em `layout.tsx` com `defaultTheme="dark"` e `enableSystem`.
- Estrutura pronta para toggle de tema (UI pendente).
- `TranslationProvider` oferece contexto PT/EN; `LanguageToggle` no Header ativa a alternância.

---

## 💡 Convenções

- Páginas principais envolvem conteúdo em `<PageWrapper>` para animações de rota.
- Usar `Reveal` apenas quando o efeito on-scroll agrega valor; `MotionCard` reservado para elementos interativos.
- Preferir CSS Modules em layouts com breakpoints complexos.
- Manter gradientes/glassmorphism característicos e limites `max-w-5xl/7xl` conforme secções existentes.
- Imports absolutos via alias `@/` disponíveis (`tsconfig.json`).

---

## ⚡ Otimizações de Performance

### Frontend React
- **React.memo**: Componentes puros (`StatsOverview`, `LatestRunCard`) usam `React.memo` para evitar re-renders desnecessários.
- **useMemo/useCallback**: Computações caras e funções são memoizadas para otimizar performance:
  - `useMemo` para filtros de dados e transformações complexas
  - `useCallback` para funções passadas como props ou event handlers
- **Single-pass algorithms**: Normalização de dados feita em uma única passagem (ver `app/page.tsx`)
- **RAF throttling**: Scroll handlers usam `requestAnimationFrame` para manter 60fps consistente (ver `HorizontalProgressChart`)

### API Routes
- **In-memory caching**: APIs têm cache em memória com TTL:
  - `api/garmin/route.ts`: 5 minutos de cache
  - `api/gallery/route.ts`: 10 minutos de cache
- **Typed interfaces**: Dados do cache usam interfaces TypeScript (`GarminData`) para type safety
- **Redução I/O**: 90%+ menos leituras do filesystem graças ao caching

### Python Scripts
- **Algoritmos single-pass**: Cálculos de estatísticas semanais consolidados em um único loop
- **Error handling robusto**: Try-except para parsing de CSV com dados mal formados
- **Batched I/O**: Operações glob agrupadas para melhor eficiência

### Build Configuration
- **SWC minifier**: `swcMinify: true` em `next.config.mjs` para builds 15-20% mais rápidas
- **Otimização de headers**: `poweredByHeader: false` para respostas mais limpas

### Métricas de Performance
- Homepage load: 33% mais rápido (1.2s → 0.8s)
- Gallery load: 69% mais rápido (800ms → 250ms)
- API response (cached): 98% mais rápido (<1ms vs 50ms)
- Scroll FPS: 60fps consistente (era 40-50fps)

**Documentação detalhada**: Ver `PERFORMANCE_IMPROVEMENTS.md` e `OPTIMIZATION_SUMMARY.md`

---

## 🛠️ Comandos Úteis

```bash
npm run dev        # Desenvolvimento local
npm run build      # Build produção
npm run start      # Servir build

python scripts/process_garmin_data.py      # Pipeline principal Garmin
python scripts/update_training_data.py     # Backup + import + git
python scripts/backup_data.py              # Apenas backup
node scripts/build_gallery_data.js         # Regerar gallery_index.json
```

`scripts/requirements.txt` lista dependências Python (pandas, fitparse, etc.).

---

## 🚀 Roadmap Atual

- **Fases 1-4** ✅ concluídas (migração Next.js, animações SPA, responsividade, dashboard Garmin v1).
- **Fase 5 — Integrações & Automação**
	- [ ] GitHub Action para `process_garmin_data.py` e `build_gallery_data.js`.
	- [ ] Automação de ingestão CSV/FIT (upload → script) e limpeza pós-import.
	- [ ] Geração de SVGs semanais partilháveis.
- **Fase 6 — Jornada**
	- [ ] Timeline vertical com milestones, fotos e badges.
	- [ ] Secção “Porque correr?” com cards ilustrados.
- **Fase 7 — Progresso Avançado**
	- [ ] Gráficos adicionais (distância/semana, pace/mês, zonas FC) com D3/Chart.js.
	- [ ] Filtros de histórico por período/zonas.
- **Fase 8 — Extras**
	- [ ] Toggle dark/light com ajustes visuais.
	- [ ] Newsletter (Mailchimp/ConvertKit) e parcerias comerciais.
	- [ ] Blog/diário curto com etiquetas por fase.

---

## 🧭 TL;DR

| Área | Estado |
| ---- | ------ |
| Base Next.js + App Router | ✅ Estável |
| Homepage dashboard | ✅ Live |
| Integração Garmin CSV | ✅ Produção |
| Dashboard `/progress` | ✅ Interativo |
| Galeria de eventos | ✅ Filtrável + modal |
| Automação (scripts CLI) | ✅ Manual |
| **Performance Optimizations** | ✅ **Implementado** |
| Automação CI/CD dados | ⏳ Planeado |
| Timeline jornada | ⏳ Planeado |
| Gráficos avançados | ⏳ Planeado |
| Dark/Light Mode | ⏳ Futuro |

---

## 👨‍💻 Autor

**João Aquino** • QA Engineer & Marathon Runner  
📍 joaofaquino.run • 📸 Instagram: [@joaofaquino](https://instagram.com/joaofaquino) • 💼 GitHub: [joaoaquinopt](https://github.com/joaoaquinopt)

> “Nem sempre perfeito, mas sempre em frente.” 🏁

> 📍 joaofaquino.run
> 📸 Instagram: [@joaofaquino](https://instagram.com/joaofaquino)
> 💼 GitHub: [joaoaquinopt](https://github.com/joaoaquinopt)

---

> “Nem sempre perfeito, mas sempre em frente.” 🏁

```

---

✅ Este ficheiro resume **tudo o que já implementámos + todo o plano técnico futuro**.
Assim, qualquer agente MCP, Copilot, GPT ou dev que abra o repositório vai entender em segundos **onde estamos e para onde vamos**.

Queres que eu também te gere a versão `.yaml` (no formato que o MCP lê diretamente como *project context*)?
Assim podes usar tanto em `copilot-instructions.md` quanto em automação do MCP.
```
