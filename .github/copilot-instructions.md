```markdown
# 🏃‍♂️ Projeto: joaofaquino.run

## 🎯 Objetivo Geral

**joaofaquino.run** é um site pessoal dinâmico e minimalista que documenta a jornada real de **João Aquino rumo à Maratona de 2026**, integrando dados de treino, progresso semanal e automação com APIs de fitness (Strava e futuramente Garmin Connect).

O projeto busca unir **autenticidade, performance e design clean**, destacando disciplina, esforço e evolução de forma transparente e automatizada.

---

## 🧱 Arquitetura Técnica

### 🗂️ Stack principal

| Camada             | Tecnologia                                        | Descrição                                                                           |
| ------------------ | ------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Frontend           | **Next.js 14 (App Router)**                       | Estrutura principal da aplicação, SPA com SSR/ISR habilitado.                       |
| Linguagem          | **TypeScript**                                    | Tipagem segura e manutenção escalável.                                              |
| Estilos            | **TailwindCSS** + **CSS Modules** + `globals.css` | Design minimalista. CSS Modules para isolamento de componentes (Header, Equipment). |
| Animações          | **Framer Motion**                                 | Transições suaves entre páginas, efeitos de scroll e hover.                         |
| Hospedagem         | **Vercel**                                        | Deploy contínuo, HTTPS automático, domínio custom `joaofaquino.run`.                |
| API de Dados       | **Python + Strava API (v3)**                      | Script para fetch e geração de `data/strava_summary.json`.                          |
| Controle de versão | **GitHub**                                        | CI/CD automático via Vercel.                                                        |

### 🎨 Estratégia de Estilos

**CSS Modules** são usados para **isolar estilos de páginas/componentes específicos**:

- `Header.module.css` - Media queries para responsividade mobile (hamburguer menu < 768px)
- `equipment.module.css` - Layout Nike-style com sidebar e grid de produtos
- `dashboard.module.css` - Estilos específicos da página de progresso

**TailwindCSS** é usado para estilos globais e utilities classes.
**globals.css** define variáveis de tema e gradientes de fundo.

---

## ⚙️ Estrutura de Pastas
```

joaofaquino.run/
│
├── app/
│ ├── layout.tsx # Estrutura global (Header, Footer, AnimatePresence)
│ ├── page.tsx # Página principal (Jornada)
│ ├── equipamentos/page.tsx # Página de parceiros e equipamentos
│ ├── progresso/page.tsx # Página de progresso e dados Strava
│ ├── privacy/page.tsx # Política de privacidade (necessária p/ Garmin API)
│ └── hooks/
│ └── useReveal.ts # Hook que ativa animação on-scroll
│
├── components/
│ ├── Header.tsx # Navegação principal do site
│ ├── Header.module.css # Estilos responsivos do Header (media queries)
│ ├── Footer.tsx # Rodapé com links sociais
│ ├── PageWrapper.tsx # Controla transições entre rotas
│ ├── Reveal.tsx # Fade/slide ao entrar na viewport
│ ├── MotionCard.tsx # Interatividade (hover/click)
│ ├── LanguageToggle.tsx # Alternador PT/EN
│ ├── TranslationProvider.tsx # Context para traduções
│
├── public/
│ ├── assets/ # Logos, imagens futuras
│
├── data/
│ └── strava_summary.json # Dados dinâmicos gerados por Python
│
├── scripts/
│ ├── fetch_strava_data.py # Faz OAuth e coleta atividades do Strava
│
├── styles/
│ └── globals.css # Tema base + ajustes de Tailwind
│
├── tailwind.config.js # Configuração Tailwind
├── postcss.config.js # Configuração de build CSS
├── tsconfig.json # BaseUrl e paths para @/ alias
├── package.json # Dependências e scripts
└── copilot-instructions.md # Documento de contexto do projeto (este)

````

---

## 🎨 Identidade Visual

**Tema:** Minimalista com tons neutros e azul escuro (referência ao Cruzeiro e ao céu).

**Paleta principal:**
```js
primary:   #0A2342
secondary: #1E4D8B
accent:    #58A6FF
light:     #ECECEC
````

**Tipografia:**

- `Montserrat` para títulos
- `Inter` e `Open Sans` para corpo

**Estilo UI:**

- Bordas arredondadas (`radius: 16px`)
- Sombra suave
- Cards translúcidos em vidro (glassmorphism)
- Hierarquia centralizada

---

## ⚡️ Comportamento de Animações (Blueprint Atual)

### Camadas de Motion e suas funções:

| Componente                 | Função                                                           | Observação                  |
| -------------------------- | ---------------------------------------------------------------- | --------------------------- |
| `PageWrapper`              | Controla a entrada/saída de cada página (fade/slide entre rotas) | Substitui `motion.section`  |
| `Reveal`                   | Faz fade + slide ao elemento entrar no viewport                  | Ideal para textos e blocos  |
| `MotionCard`               | Dá hover/press com brilho e movimento 3D leve                    | Usado em cards clicáveis    |
| `AnimatePresence` (layout) | Garante transições de página fluidas                             | Configurado no `layout.tsx` |

✅ **Combinação recomendada:**

```tsx
<Reveal delay={0.1}>
  <MotionCard delay={0.2}>
    <Conteúdo />
  </MotionCard>
</Reveal>
```

---

## 🚧 Próximas Fases (Roadmap Técnico)

### ✅ Fase 1 — Migração Next.js

- [x] Migração de HTML/CSS estático → Next.js + TypeScript
- [x] Setup TailwindCSS, PostCSS, estrutura App Router
- [x] Deploy na Vercel com domínio custom

### ✅ Fase 2 — SPA e Transições

- [x] Implementar `AnimatePresence` no layout
- [x] Criar `PageWrapper` e remover motion.section redundantes
- [x] Rotas dinâmicas para Home / Progresso / Equipamentos / Contato

### ✅ Fase 3 — Interações Avançadas

- [x] Scroll animations (`Reveal`)
- [x] Microinterações (`MotionCard`)
- [x] Header responsivo com CSS Module (hamburguer < 768px, desktop navigation ≥ 768px)
- [x] Equipment page Nike-style com CSS Module isolation
- [ ] Dark/Light Mode com persistência (via `next-themes`)

### ✅ Fase 3.5 — Responsividade Mobile (CONCLUÍDA)

- [x] Criado `Header.module.css` com media queries para controle preciso
- [x] Desktop (≥768px): Navegação horizontal sempre visível, sem hamburguer
- [x] Mobile (<768px): Botão hamburguer visível, navegação escondida
- [x] Overlay mobile com backdrop blur e links touch-friendly
- [x] Isolamento de estilos via CSS Modules para evitar conflitos com Tailwind
- [x] Media queries testadas em resolução 1920x1080

### ✅ Fase 4 — Integração Garmin + Dashboard Homepage (CONCLUÍDA 20/11/2025)

**🎯 Objetivo:** Migrar de Strava para Garmin CSV, criar dashboard visual na homepage com dados reais de treino.

#### Implementações:

**1. Processamento de Dados Garmin**

- [x] Criado `scripts/process_garmin_data.py` - Parser de CSV do Garmin Connect
- [x] Lê `data/garmin_exports/Todas_As_Corridas.csv` (13 corridas exportadas)
- [x] Gera `public/data/garmin_summary.json` com estatísticas processadas
- [x] Calcula: distância total (90.44km), pace médio (7:35/km), progresso maratona (214%)
- [x] Estatísticas semanais: última semana (3 corridas, 24.42km)
- [x] Última corrida: 20/11/2025 - "Porto - 3x (400m @Z5 + 400m @Z1)" - 5.49km

**2. Componentes Dashboard (Design Moderno)**

- [x] `StatsOverview.tsx` - Cards hero com gradientes vibrantes
  - 2 cards grandes: Distância Total (azul→roxo) + Esta Semana (verde→teal)
  - Progress bar animada para meta maratona (42.195km)
  - 4 cards secundários compactos com glassmorphism
  - Números gigantes (text-6xl) para métricas principais
- [x] `LatestRunCard.tsx` - Card premium da última corrida

  - Gradiente rosa→roxo com decoração de círculos
  - Distância em destaque (text-5xl)
  - Grid com tempo, pace, FC médio, calorias
  - Efeito glassmorphism nos sub-cards

- [x] `CTASection.tsx` - Call-to-action impactante
  - Gradiente laranja→rosa→roxo
  - Padrão de bolinhas no background
  - Botões grandes com hover scale
  - Links para Instagram (@joaofaquino) e Strava

**3. Homepage Redesign**

- [x] Layout grid responsivo (lg:grid-cols-3)
- [x] Sidebar sticky com LatestRunCard (fixa ao scroll em desktop)
- [x] Stats overview no topo (full width)
- [x] Texto da jornada com animações Reveal
- [x] CTA section no final (full width)
- [x] Max-width aumentado para 7xl (melhor uso do espaço)

**4. Características Visuais**

- [x] Gradientes vibrantes em todos os cards
- [x] Glassmorphism (backdrop-blur + transparências)
- [x] Números gigantes para métricas principais
- [x] Hover effects (scale, translate)
- [x] Progress bars animadas com cores chamativas
- [x] Ícones coloridos e contextualizados (Lucide React)
- [x] Sombras profundas (shadow-2xl)

**5. Dados Garmin vs Strava**

- ✅ **Migração completa:** CSV Garmin substituiu Strava API
- ✅ **Formato:** `Todas_As_Corridas.csv` (Activity Type, Date, Distance, Time, Pace, HR, etc.)
- ✅ **Processamento:** Python script executa parsing e gera JSON
- ✅ **Frontend:** Fetch de `/data/garmin_summary.json` via useEffect
- ✅ **Automação:** Script Python pode ser executado manualmente: `python scripts/process_garmin_data.py`

**Ficheiros Criados/Modificados:**

```
scripts/process_garmin_data.py          # Parser CSV → JSON
public/data/garmin_summary.json         # Dados processados
components/StatsOverview.tsx            # Cards hero com gradientes
components/LatestRunCard.tsx            # Card última corrida
components/CTASection.tsx               # Call-to-action
app/page.tsx                            # Homepage redesenhada
```

**Estatísticas Atuais (20/11/2025):**

- 📊 Total: 13 corridas
- 🏃 Distância: 90.44 km
- ⏱️ Tempo total: 11h 26min
- 📈 Pace médio: 7:35/km
- 📅 Esta semana: 3 corridas, 24.42km
- 🎯 Progresso maratona: 214% (já ultrapassou!)

---

### 🏃 Fase 5 — Integração e Automação (PRÓXIMO)

- [ ] Conectar `process_garmin_data.py` com GitHub Actions (execução automática)
- [ ] Automatizar upload de novos CSVs do Garmin Connect
- [ ] Gerar SVGs dinâmicos com estatísticas semanais

### 🚀 Fase 6 — Página Jornada Melhorada (PLANEADO)

**🎯 Objetivo:** Transformar página da jornada em timeline visual com fotos, ícones e milestones.

- [ ] Adicionar timeline vertical com marcos importantes
- [ ] Inserir fotos/placeholders para momentos chave
- [ ] Quebrar texto denso com cards visuais
- [ ] Adicionar ícones para cada fase da jornada
- [ ] Implementar "prova social" (badges de conquistas)
- [ ] Seção "Porque correr?" com cards ilustrados

### 🚀 Fase 7 — Página Progresso com Gráficos (PLANEADO)

- [ ] Criar gráficos de evolução (distância/semana, pace/mês)
- [ ] Implementar histórico de corridas com filtros
- [ ] Visualização de zonas de frequência cardíaca
- [ ] Comparação mês a mês
- [ ] Integração com D3.js ou Chart.js

### 🚀 Fase 8 — Features Adicionais (FUTURO)

- [ ] Dark/Light Mode com persistência (via `next-themes`)
- [ ] Newsletter signup (Mailchimp/ConvertKit)
- [ ] Monetização: produtos/serviços
- [ ] Blog de corrida (opcional)

---

## 🔒 Configuração do Garmin (atual)

**Fonte de dados:** CSV exportado do Garmin Connect  
**Localização:** `data/garmin_exports/Todas_As_Corridas.csv`  
**Processamento:** Script Python `scripts/process_garmin_data.py`  
**Output:** `public/data/garmin_summary.json`

**Comando manual:**

```bash
python scripts/process_garmin_data.py
```

**Campos CSV utilizados:**

- Activity Type, Date, Title
- Distance, Time, Avg Pace, Best Pace
- Avg HR, Max HR, Calories
- Total Ascent, Total Descent

**Nota:** Strava API foi descontinuada. Migração para Garmin CSV concluída com sucesso.

### 🚀 Fase 5 — Dashboards e Expansão

- [ ] Criar páginas com gráficos e progresso histórico (D3.js / Chart.js)
- [ ] Implementar área de “Galeria de Corridas”
- [ ] Integrar afiliados e parceiros com links dinâmicos

---

## 🔒 Configuração do Strava (atual)

Variáveis de ambiente (em `.env.local`):

```env
STRAVA_CLIENT_ID=184688
STRAVA_CLIENT_SECRET=xxxxxxxxxxxxxxxx
STRAVA_REFRESH_TOKEN=xxxxxxxxxxxxxxxx
STRAVA_REDIRECT_URI=http://localhost
```

Python faz autenticação OAuth2 e salva o resumo em `data/strava_summary.json`.

---

## 🌍 Privacidade e Conformidade

- Política de privacidade servida em `/privacy` (requisito para Garmin API)
- Dados de treino são pessoais e só são publicados com consentimento do atleta
- Cookies e analytics ainda **não implementados**

---

## 🤖 Convenções de Desenvolvimento

### Diretivas

- Todas as páginas principais usam `<PageWrapper>`
- Elementos interativos: `<Reveal>` + `<MotionCard>`
- Imports absolutos via alias `@/` (opcional, configurado em `tsconfig.json`)
- Responsividade padrão: `max-w-5xl mx-auto px-4`

### CSS Modules vs Tailwind

**IMPORTANTE**: Para componentes que precisam de responsividade complexa com media queries, usar **CSS Modules**:

- ✅ `Header.module.css` - Controla hamburguer mobile vs desktop navigation
- ✅ `equipment.module.css` - Layout Nike-style com sidebar responsiva
- ✅ `dashboard.module.css` - Grid layouts com breakpoints customizados

**Razão**: Classes Tailwind como `md:hidden` podem não compilar corretamente em hot-reload. CSS Modules garantem comportamento previsível.

**Breakpoints padrão**:

- Mobile: `< 768px` (hamburguer menu)
- Tablet/Desktop: `≥ 768px` (navegação normal)

### Scripts de build

```bash
npm run dev     # Desenvolvimento local
npm run build   # Compilação para produção
npm run start   # Servir build localmente
```

---

## 🔮 Visão de Futuro

- **Meta 2026:** transformar o site numa plataforma viva de performance e consistência.
- Automatizar geração de SVGs semanais do progresso de treino.
- Criar uma camada de API própria (`/api/strava`) para cache e segurança.
- Implementar _progress cards_ dinâmicos com base nos dados JSON.
- Fazer integração completa com Garmin Connect, eliminando dependência do Strava.

---

## 🧭 TL;DR

| Categoria                | Estado             |
| ------------------------ | ------------------ |
| Base Next.js             | ✅ Completa        |
| Estilo visual            | ✅ Dashboard Ready |
| SPA + Transições         | ✅ Funcional       |
| Animações (Scroll/Hover) | ✅ Ativas          |
| Homepage Dashboard       | ✅ Implementado    |
| Integração Garmin CSV    | ✅ Funcional       |
| Sidebar Gallery Layout   | ✅ Implementado    |
| Dark/Light mode          | ⏳ Futuro          |
| Automação GitHub Actions | 🧩 Próximo         |
| Página Jornada Timeline  | 🧩 Planeado        |
| Gráficos Progresso       | 🧩 Planeado        |

---

## 👨‍💻 Autor

**João Aquino**
QA Engineer & Marathon Runner
📍 joaofaquino.run
📸 Instagram: [@joaofaquino](https://instagram.com/joaofaquino)
💼 GitHub: [joaoaquinopt](https://github.com/joaoaquinopt)

---

> “Nem sempre perfeito, mas sempre em frente.” 🏁

```

---

✅ Este ficheiro resume **tudo o que já implementámos + todo o plano técnico futuro**.
Assim, qualquer agente MCP, Copilot, GPT ou dev que abra o repositório vai entender em segundos **onde estamos e para onde vamos**.

Queres que eu também te gere a versão `.yaml` (no formato que o MCP lê diretamente como *project context*)?
Assim podes usar tanto em `copilot-instructions.md` quanto em automação do MCP.
```
