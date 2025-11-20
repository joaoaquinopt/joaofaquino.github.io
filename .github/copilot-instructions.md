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

### ✅ Fase 3.5 — Responsividade Mobile (RECÉM CONCLUÍDA)

- [x] Criado `Header.module.css` com media queries para controle preciso
- [x] Desktop (≥768px): Navegação horizontal sempre visível, sem hamburguer
- [x] Mobile (<768px): Botão hamburguer visível, navegação escondida
- [x] Overlay mobile com backdrop blur e links touch-friendly
- [x] Isolamento de estilos via CSS Modules para evitar conflitos com Tailwind
- [x] Media queries testadas em resolução 1920x1080

### 🏃 Fase 4 — Integração e Automação

- [ ] Conectar `fetch_strava_data.py` com o site via GitHub Actions
- [ ] Gerar SVGs dinâmicos com estatísticas Strava
- [ ] Migrar integração para **Garmin Connect API** (após aprovação)

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

| Categoria                | Estado          |
| ------------------------ | --------------- |
| Base Next.js             | ✅ Completa     |
| Estilo visual            | ✅ Restaurado   |
| SPA + Transições         | ✅ Funcional    |
| Animações (Scroll/Hover) | ✅ Ativas       |
| Dark/Light mode          | ⏳ Próximo      |
| Integração Strava        | ⚙️ Em progresso |
| Integração Garmin        | 🧩 Planeado     |
| Automação GitHub Actions | 🧩 Planeado     |
| Dashboards e SVGs        | 🧩 Planeado     |

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
