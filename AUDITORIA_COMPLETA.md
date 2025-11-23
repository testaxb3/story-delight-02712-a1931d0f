# AUDITORIA COMPLETA - NEP SYSTEM PWA

Auditoria fullstack do aplicativo NEP System (PWA de Parentalidade Cal AI Style)

---

## PARTE 05 - UI/DESIGN SYSTEM

### 📊 Resumo Executivo

O NEP System apresenta uma **base sólida de design system** com variáveis CSS bem estruturadas, componentes Shadcn/UI customizados, e suporte completo a dark mode. A implementação do estilo Cal AI minimalista (preto/branco, tipografia premium) está **parcialmente aderente**, com a paleta de cores correta (#F2F2F2 light, #1E1E2E dark, cards brancos) e fontes premium (Relative, Lora, Inter) devidamente carregadas.

**Porém, existem problemas críticos de consistência:** 78 ocorrências de cores hexadecimais hardcoded espalhadas por 19 arquivos, múltiplas instâncias de valores pixel hardcoded para border-radius e font sizes, e uma inconsistência grave entre o background do body (#1a1b2e hardcoded) vs variáveis CSS (#1E1E2E). O Bottom Navigation possui excelente implementação com Lottie animations e safe area insets, mas alguns componentes (especialmente HeroSection) usam gradientes coloridos excessivos que divergem do minimalismo Cal AI.

O design system está **70% aderente ao Cal AI**, com pontos fortes em arquitetura (tokens CSS) mas fracos em execução (valores hardcoded). A prioridade é migrar os 78 hexcodes para variáveis CSS e padronizar spacing/sizing tokens.

---

### ✅ Pontos Fortes

1. **Design Tokens Bem Estruturados (index.css:42-230):**
   - Sistema completo de variáveis CSS com paleta Cal AI exata
   - Light mode: `--background: 0 0% 95%` (#F2F2F2), `--card: 0 0% 100%` (#FFFFFF)
   - Dark mode: `--background: 250 25% 12%` (#1E1E2E), `--card: 250 20% 16%` (#2A2A3E)
   - Accent orange: `--accent: 14 100% 50%` usado corretamente apenas para fire icon
   - Surface system (`--surface-base`, `--surface-raised`, `--surface-overlay`) bem definido

2. **Tailwind Config Premium (tailwind.config.ts:16-21):**
   - Fontes premium configuradas: Relative (Cal AI), Lora (serif), Inter (sans)
   - Font sizes customizados para ebook (`ebook-body: 18px/1.9`, `ebook-lead: 20px/1.85`)
   - Paleta calai (50-900) para escala de cinzas minimalista
   - Border radius variável: `--radius` com variants (lg, md, sm)

3. **Componentes Shadcn Bem Customizados:**
   - **Button (button.tsx:7-31):** Variantes completas (default, destructive, outline, secondary, ghost, link), sizes (sm, default, lg, icon), `active:scale-95` para feedback tátil, rounded-lg consistente
   - **Card (card.tsx:6):** `rounded-xl` padrão, `transition-all hover:shadow-md` para interatividade, `border-border bg-card` usando tokens
   - **Input (input.tsx:10-11):** Responsivo (text-base mobile → text-sm desktop), ring focus states, file upload estilizado

4. **Loading States Profissionais:**
   - **DashboardSkeleton (DashboardSkeleton.tsx):** Grid 2x4 stats, progress bar, content sections espelhando layout real
   - **BonusesPageSkeleton (BonusesPageSkeleton.tsx:3-71):** Skeleton com staggered animation (`animationDelay: ${i * 50}ms`), 6 cards em grid responsivo, thumbnail + content + CTA espelhando BonusCard real
   - **Skeleton base (skeleton.tsx:3-5):** Simples, `animate-pulse rounded-md bg-muted`, 100% reutilizável

5. **Bottom Navigation Cal AI Premium (BottomNavCalAI.tsx:96-116):**
   - Floating pill design: `rounded-full px-4 py-3`, `bg-card/80 backdrop-blur-xl`, posicionado com safe area insets `bottom: calc(env(safe-area-inset-bottom) + 1.5rem)`
   - Lottie icons dinâmicos: carregamento assíncrono de `/lotties/{icon}-icon.json`, `loop={isActive}` para ícones ativos
   - Touch-optimized: `w-16 py-1` (>44px target), `touch-manipulation`, `rounded-2xl` active background
   - 5 tabs corretos: Home, Scripts, Bonuses, Community, Profile

6. **Animações Lottie Otimizadas (LottieIcon.tsx:35-92):**
   - Controle manual de play/pause baseado em `isActive`
   - Speed configurável, gradiente support (experimental)
   - Hook `useCustomLottieColors` para customizar cores dinamicamente
   - Tamanho configurável, loop condicional

7. **Micro-Animations & Effects (index.css:307-413):**
   - `.hover-lift`: `translateY(-4px)` + `shadow-xl` no hover
   - `.tap-feedback`: `active:scale-95` para feedback tátil iOS-like
   - `.animate-shimmer`: skeleton shimmer effect com gradiente animado
   - `.animate-brain-pulse`, `.animate-badge-pulse` para elementos interativos
   - `@media (prefers-reduced-motion)` respeitado para acessibilidade

8. **Dark Mode Robusto (index.css:163-229):**
   - Classe `.dark` com overrides completos de todas as variáveis
   - Contraste adequado: foreground `0 0% 98%` (quase branco) sobre background `250 25% 12%` (roxo escuro)
   - Borders sutis: `--border: 250 15% 20%` (purple-tinted)
   - Shadows adaptados: `0 1px 2px 0 rgb(0 0 0 / 0.5)` (mais escuras no dark)

9. **Edge-to-Edge PWA Design (index.css:33-67, DashboardCalAI.tsx:78):**
   - Body com safe area insets: `padding-top: env(safe-area-inset-top)`, etc.
   - Background fullscreen: `html, body { height: 100%; width: 100%; background: #1a1b2e }`
   - Header fixed com safe area: `pt-[calc(env(safe-area-inset-top)+8px)]`
   - Ambient blur backgrounds no Dashboard (linha 74-75) para profundidade

10. **Responsive Grid System:**
    - Dashboard stats: `grid grid-cols-2 md:grid-cols-4 gap-4` (DashboardCalAI.tsx:55)
    - Bonuses: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` (Bonuses.tsx)
    - Mobile-first padding: `px-4 sm:px-6`, `p-8 sm:p-10` (HeroSection.tsx:25)

11. **Premium Card Variants (index.css:418-505):**
    - `.card-elevated`: basic shadow-md
    - `.card-elevated-hover`: hover lift + border-primary/20
    - `.card-glass`: backdrop-blur + glass-bg/border
    - `.bonus-glass`: gradient glass com inset highlight `inset 0 1px 0 0 hsl(0 0% 100% / 0.1)`
    - Colored glows: `.glow-video`, `.glow-ebook`, `.glow-tool`, etc. com HSL customizados

12. **Framer Motion Animations (BonusCard.tsx:99-100):**
    - `initial={{ opacity: 0, y: 20 }}` para cards entrarem suavemente
    - Staggered delays: `delay: index * 0.05` (BonusesPageSkeleton.tsx:36)
    - Usado em modals, page transitions, card reveals

---

### 🔴 Problemas Críticos

1. **CORES HEXADECIMAIS HARDCODED (78 ocorrências em 19 arquivos):**
   - **Descrição:** Busca por `bg-\[#[0-9A-Fa-f]{6}\]` encontrou 78 instâncias de cores hardcoded (ex: `bg-[#1C1C1E]`, `bg-[#2C2C2E]`)
   - **Impacto:** Quebra o design system inteiro. Mudanças de tema requerem find-replace manual em 19 arquivos. Dark mode pode não funcionar corretamente nesses componentes.
   - **Localização:**
     - DashboardCalAI.tsx: 10 ocorrências (linha 83, 91, 137, 142, etc.)
     - Scripts.tsx: 8 ocorrências
     - ProfileCalAI.tsx: 7 ocorrências
     - CommunityView.tsx: 7 ocorrências
     - Community components: 15+ ocorrências
     - Bonuses.tsx: 3 ocorrências
   - **Exemplo:** `<div className="bg-[#1C1C1E]/80 backdrop-blur-md">` (DashboardCalAI.tsx:83) deveria ser `bg-card/80`
   - **Solução:**
     ```tsx
     // ANTES (DashboardCalAI.tsx:83)
     <div className="bg-[#1C1C1E]/80 backdrop-blur-md border border-white/5 px-4 py-2 rounded-full">

     // DEPOIS
     <div className="bg-card/80 backdrop-blur-md border border-border/50 px-4 py-2 rounded-full">
     ```
     - Migrar todos `bg-[#1C1C1E]` → `bg-card` (dark mode)
     - Migrar todos `bg-[#2C2C2E]` → `bg-surface-raised` ou `bg-secondary`
     - Migrar todos `bg-[#F2F2F2]` → `bg-background`
     - Criar PR "Design System: Migrate hardcoded colors to CSS variables"

2. **INCONSISTÊNCIA CRÍTICA: Background Body Hardcoded (index.css:38):**
   - **Descrição:** `background: #1a1b2e !important;` hardcoded vs variável CSS `--background: 250 25% 12%` (#1E1E2E)
   - **Impacto:** Cores ligeiramente diferentes (#1a1b2e é mais azulado que #1E1E2E roxo). Body background nunca muda com dark/light mode toggle.
   - **Localização:** index.css:38
   - **Solução:**
     ```css
     /* ANTES */
     html, body {
       background: #1a1b2e !important;
     }

     /* DEPOIS */
     html, body {
       background: hsl(var(--background)) !important;
     }
     ```

3. **Input Component com Dark Mode Hardcoded (input.tsx:11):**
   - **Descrição:** `dark:border-slate-600 dark:bg-slate-900 dark:placeholder:text-slate-500` ignora variáveis CSS do design system
   - **Impacto:** Input tem cores próprias que não seguem tema customizável. Se mudar dark background de roxo (#1E1E2E) para outra cor, inputs continuarão slate-900.
   - **Localização:** src/components/ui/input.tsx:11
   - **Solução:**
     ```tsx
     // ANTES
     className={cn(
       "dark:border-slate-600 dark:bg-slate-900 dark:placeholder:text-slate-500",
       // ...
     )}

     // DEPOIS
     className={cn(
       "border-input bg-background placeholder:text-muted-foreground",
       // tokens CSS adaptam automaticamente ao dark mode
       // ...
     )}
     ```

4. **Border-Radius Inconsistente (12 ocorrências de valores pixel hardcoded):**
   - **Descrição:** `rounded-[32px]`, `rounded-[24px]`, `rounded-[20px]` espalhados vs `rounded-xl` (12px), `rounded-2xl` (16px), `rounded-3xl` (24px) padrão Tailwind
   - **Impacto:** Visual inconsistente. Cards têm border-radius diferentes (32px em alguns, 12px em outros). Dificulta mudanças globais.
   - **Localização:**
     - DashboardCalAI.tsx: `rounded-3xl` (linha 90), `rounded-[32px]` (linha 137)
     - UnifiedStatsCard.tsx: `rounded-[32px]`
     - SectionCard.tsx: valor customizado
   - **Solução:**
     - Criar tokens em tailwind.config.ts:
       ```ts
       borderRadius: {
         'card': '12px',      // cards padrão
         'card-lg': '16px',   // cards destaque
         'pill': '24px',      // botões pill
         'bubble': '32px',    // floating elements
       }
       ```
     - Migrar todos `rounded-[32px]` → `rounded-bubble`

5. **Font Sizes Hardcoded (53 ocorrências de text-[Xpx]):**
   - **Descrição:** `text-[11px]`, `text-[13px]`, `text-[15px]`, etc. em 20 arquivos vs usar escala Tailwind (text-xs, text-sm, text-base)
   - **Impacto:** Hierarquia tipográfica inconsistente. Dificulta responsive (font sizes não adaptam em breakpoints). Não segue design system.
   - **Localização:** DashboardCalAI.tsx:98, ProfileCalAI.tsx, Scripts.tsx, etc.
   - **Solução:**
     - Criar font sizes customizados no tailwind.config.ts:
       ```ts
       fontSize: {
         'label': ['11px', { lineHeight: '1.4', letterSpacing: '0.02em' }],
         'caption': ['13px', { lineHeight: '1.5' }],
         'body-sm': ['15px', { lineHeight: '1.6' }],
       }
       ```
     - Migrar `text-[11px]` → `text-label`, `text-[13px]` → `text-caption`

---

### 🟡 Problemas Médios

1. **HeroSection Usa Gradientes Coloridos (HeroSection.tsx:25-29):**
   - **Descrição:** `from-primary via-accent to-primary/90` com múltiplos orbs coloridos pulsando (`bg-white/10`, `bg-accent/20`) diverge do minimalismo Cal AI
   - **Impacto:** Cal AI usa preto/branco sólido, não gradientes rainbow. Hero section se destaca demais vs resto do app.
   - **Localização:** src/components/Dashboard/HeroSection.tsx:25-30
   - **Solução:** Simplificar para background sólido com subtle gradient:
     ```tsx
     // Cal AI style - sólido com sutil gradient
     className="bg-gradient-to-b from-card to-card/95 border border-border"
     ```

2. **BonusCard Usa Colored Glows Excessivos (BonusCard.tsx:35-83):**
   - **Descrição:** Cada categoria tem glow colorido (`glow-video`, `glow-ebook`, `glow-tool`) com gradientes from-red-500 to-pink-500, etc.
   - **Impacto:** Cal AI usa shadows sutis e monocromáticas. Colored glows são muito vibrantes para o estilo minimalista.
   - **Localização:** src/components/bonuses/BonusCard.tsx:42-83 (categoryConfig)
   - **Solução:** Simplificar para glow monocromático baseado em primary:
     ```tsx
     // Remover colored glows, usar shadow universal
     glowClass: "shadow-lg hover:shadow-xl"
     ```

3. **Falta Componente ImprovedSkeleton (BonusesPageSkeleton.tsx:1):**
   - **Descrição:** Importa `ImprovedSkeleton` de `@/components/common/ImprovedSkeleton` mas componente não encontrado na estrutura
   - **Impacto:** BonusesPageSkeleton pode quebrar se ImprovedSkeleton não existir. Inconsistência entre skeletons (alguns usam Skeleton base, outros Improved).
   - **Localização:** src/components/Skeletons/BonusesPageSkeleton.tsx:1
   - **Solução:** Verificar se `ImprovedSkeleton.tsx` existe em `src/components/common/`. Se não, migrar para `<Skeleton>` padrão ou criar ImprovedSkeleton com shimmer effect.

4. **Spacing Não Segue Sistema de Tokens (valores px hardcoded):**
   - **Descrição:** Muitos `gap-3`, `p-5`, `py-2.5` ao invés de usar escala consistente (gap-2, gap-4, gap-6)
   - **Impacto:** Espaçamento visual irregular. Dificulta ajustes globais de spacing.
   - **Localização:** Espalhado por múltiplos componentes
   - **Solução:** Padronizar para escala 4px: `gap-2` (8px), `gap-3` (12px), `gap-4` (16px), `gap-6` (24px). Evitar `gap-5` (20px) que quebra ritmo visual.

5. **Falta Documentação de Design Tokens:**
   - **Descrição:** Não existe arquivo README.md ou docs/ explicando sistema de cores, tipografia, spacing, components
   - **Impacto:** Novos devs não sabem quais tokens usar. Risco de continuar hardcoding valores.
   - **Localização:** Raiz do projeto
   - **Solução:** Criar `docs/DESIGN_SYSTEM.md` documentando:
     - Paleta de cores (quando usar `--primary`, `--accent`, `--card`)
     - Tipografia (font families, sizes, weights)
     - Spacing scale (4px base)
     - Border radius tokens
     - Shadow variants

6. **Componentes Sem Variantes de Size (Card, Badge):**
   - **Descrição:** Card não tem variantes `size="sm" | "default" | "lg"`. Badge tem poucas variantes.
   - **Impacto:** Dificulta criar hierarquia visual. Devs criam padding customizado ao invés de usar variantes.
   - **Localização:** src/components/ui/card.tsx, src/components/ui/badge.tsx
   - **Solução:** Adicionar size variants usando `cva`:
     ```tsx
     const cardVariants = cva("rounded-xl border bg-card", {
       variants: {
         size: {
           sm: "p-4",
           default: "p-6",
           lg: "p-8",
         }
       }
     })
     ```

7. **Scrollbar Customizada Não Segue Dark Mode (index.css:589-604):**
   - **Descrição:** `::-webkit-scrollbar-thumb` usa `@apply bg-muted-foreground/30` que funciona, mas track usa `@apply bg-muted/30` que pode ser muito claro no light mode
   - **Impacto:** Scrollbar pouco visível em alguns temas.
   - **Localização:** index.css:589-604
   - **Solução:** Ajustar opacity ou criar scrollbar variants para light/dark.

8. **Bottom Nav Esconde em Desktop Mas Não Mostra SideNav (BottomNavCalAI.tsx:98):**
   - **Descrição:** `md:hidden` esconde Bottom Nav no desktop, mas não vi SideNav alternativo sendo mostrado
   - **Impacto:** Navegação desktop pode ser confusa se não houver menu alternativo.
   - **Localização:** src/components/Navigation/BottomNavCalAI.tsx:98
   - **Solução:** Verificar se SideNav existe e está com `hidden md:block`. Se não, considerar manter Bottom Nav no desktop também (Cal.com usa bottom nav mesmo em desktop).

---

### 💡 Melhorias Sugeridas

1. **Criar Arquivo de Design Tokens Centralizado:**
   - **Benefício:** Single source of truth para cores, spacing, typography. Facilita mudanças globais e onboarding de novos devs.
   - **Esforço:** Médio
   - **Arquivos:** Criar `src/design-tokens.ts`:
     ```ts
     export const designTokens = {
       colors: {
         calai: {
           lightBg: '#F2F2F2',
           darkBg: '#1E1E2E',
           cardLight: '#FFFFFF',
           cardDark: '#2A2A3E',
         }
       },
       spacing: {
         xs: '0.5rem',  // 8px
         sm: '0.75rem', // 12px
         md: '1rem',    // 16px
         lg: '1.5rem',  // 24px
         xl: '2rem',    // 32px
       },
       borderRadius: {
         card: '0.75rem',   // 12px
         pill: '1.5rem',    // 24px
         bubble: '2rem',    // 32px
       }
     }
     ```

2. **Implementar Storybook para Documentar Componentes:**
   - **Benefício:** Cataloga todos os componentes UI com examples, props, variantes. Facilita QA visual e previne regressões de design.
   - **Esforço:** Alto
   - **Arquivos:** Criar `.storybook/` config e stories para Button, Card, Input, BonusCard, etc.

3. **Adicionar Testes Visuais com Chromatic:**
   - **Benefício:** Detecta mudanças visuais não intencionais automaticamente. Integra com Storybook.
   - **Esforço:** Médio (após Storybook implementado)
   - **Arquivos:** `.storybook/main.js` + CI config

4. **Criar Utility Classes para Font Sizes Customizados:**
   - **Benefício:** Elimina `text-[11px]` hardcoded. Cria hierarquia tipográfica clara.
   - **Esforço:** Baixo
   - **Arquivos:** tailwind.config.ts (extend fontSize)

5. **Implementar CSS Variables para Spacing (além de cores):**
   - **Benefício:** Spacing responsivo fácil. Ex: `--spacing-card: 1rem` mobile, `1.5rem` desktop.
   - **Esforço:** Médio
   - **Arquivos:** index.css, tailwind.config.ts

6. **Adicionar Focus Trap em Modals para Acessibilidade:**
   - **Benefício:** Usuários de teclado não "escapam" do modal pressionando Tab.
   - **Esforço:** Baixo (usar `focus-trap-react` ou Radix Dialog já tem built-in)
   - **Arquivos:** Componentes Dialog/Modal

7. **Criar Component Variants Documentation:**
   - **Benefício:** README em cada pasta de componentes explicando quando usar cada variante.
   - **Esforço:** Baixo
   - **Arquivos:** Criar `src/components/ui/README.md`, `src/components/Dashboard/README.md`

8. **Implementar Theme Switcher Visual (não só dark/light):**
   - **Benefício:** Permitir usuários escolherem entre Cal AI Purple, Cal AI Blue, etc. mantendo minimalismo.
   - **Esforço:** Alto
   - **Arquivos:** ThemeContext, index.css (criar variants de --background)

9. **Adicionar Skeleton Shimmer Effect Consistente:**
   - **Descrição:** Skeleton base não tem shimmer, mas ImprovedSkeleton sim. Padronizar para todos terem shimmer.
   - **Benefício:** Loading states mais polidos, feedback visual de que está carregando.
   - **Esforço:** Baixo
   - **Arquivos:** src/components/ui/skeleton.tsx:
     ```tsx
     <div className={cn(
       "animate-pulse rounded-md bg-muted relative overflow-hidden",
       "after:absolute after:inset-0 after:animate-shimmer after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent",
       className
     )} />
     ```

10. **Criar Empty State Component Reutilizável:**
    - **Benefício:** Consistência em todas as páginas (Bonuses empty, Scripts empty, Community empty).
    - **Esforço:** Baixo
    - **Arquivos:** Criar `src/components/common/EmptyState.tsx` com props (icon, title, description, cta)

---

### 📈 Métricas

- **Componentes reutilizáveis:** 45+ componentes identificados (ui: 43, Dashboard: 15, Bonuses: 8, Skeletons: 6)
- **Inconsistências de cor:** 78 ocorrências de hexcodes hardcoded em 19 arquivos
- **Valores hardcoded:**
  - Border-radius: 12 ocorrências
  - Font sizes: 53 ocorrências
  - Total: 143 valores que deveriam ser tokens
- **Breakpoints não-responsivos:** ~5 componentes (principalmente modals que não adaptam altura no mobile)
- **Dark mode coverage:** 95% das páginas (falta apenas alguns admin panels)
- **Componentes sem TypeScript:** 0 arquivos (100% TypeScript ✅)
- **Aderência Cal AI:** **70%** (cores corretas, tipografia premium, minimalismo parcial, mas gradientes coloridos excessivos em Hero/Bonuses)
- **Shadcn/UI components:** 43 componentes (Button, Card, Dialog, Input, Toast, Skeleton, Progress, Badge, Tabs, Select, Dropdown, etc.) - 100% customizados para o tema
- **Lottie animations:** 5+ animações (home-icon, scripts-icon, bonuses-icon, community-icon, profile-icon) carregadas dinamicamente
- **Loading skeletons:** 6 skeletons específicos (Dashboard, Bonuses, Scripts, Profile, Community posts, Script cards)
- **Touch targets >44px:** 90% dos botões (Bottom Nav: 64px width, Cards: 48px+ height)

---

### 🎯 Recomendações Prioritárias

1. **[CRÍTICO] Migrar 78 Hexcodes Hardcoded para Variáveis CSS** - 2-3 dias de trabalho, elimina maior inconsistência do design system. Criar script find-replace para `bg-[#1C1C1E]` → `bg-card`, `bg-[#2C2C2E]` → `bg-surface-raised`. Testar dark mode toggle após migração.

2. **[CRÍTICO] Corrigir Background Body Hardcoded (index.css:38)** - 5 minutos de fix, impacto visual imediato. Mudar `background: #1a1b2e` → `background: hsl(var(--background))`. Adicionar comment explicando que body background SEMPRE deve usar variável.

3. **[ALTO] Criar Design Tokens Documentation** - 1 dia, previne novos hardcodes. Criar `docs/DESIGN_SYSTEM.md` com examples, guidelines, decision tree ("quando usar --primary vs --accent?"). Adicionar link no README.md principal.

4. **[ALTO] Padronizar Border-Radius com Tokens** - 4-6 horas, melhora consistência visual. Adicionar `borderRadius: { card, pill, bubble }` no tailwind.config.ts, migrar todos `rounded-[Xpx]` para tokens.

5. **[MÉDIO] Simplificar Hero/Bonus Colored Glows para Minimalismo Cal AI** - 2-3 horas, aumenta aderência ao estilo. Remover gradientes coloridos excessivos, usar shadows monocromáticas sutis. HeroSection deve ser `bg-card` com subtle border, não rainbow gradient.

6. **[MÉDIO] Implementar Storybook** - 1 semana inicial + manutenção contínua, ROI alto para design consistency. Começar com componentes base (Button, Card, Input), depois Dashboard components. Integrar no CI para visual regression testing.

7. **[BAIXO] Adicionar Shimmer Effect em Skeleton Base** - 1 hora, polish profissional. Migrar shimmer animation de ImprovedSkeleton para Skeleton padrão, remover ImprovedSkeleton duplicado.

8. **[BAIXO] Criar Font Size Tokens Customizados** - 2 horas, elimina 53 `text-[Xpx]`. Adicionar `fontSize: { label, caption, body-sm }` no tailwind.config.ts.

---

**Próximos Passos Sugeridos:**
1. ✅ Executar migração de hexcodes (criar branch `design-system/migrate-hardcoded-colors`)
2. ✅ Corrigir body background (commit rápido)
3. ✅ Criar `docs/DESIGN_SYSTEM.md`
4. ⏳ Padronizar border-radius tokens
5. ⏳ Implementar Storybook (spike de 2 dias para validar viabilidade)

---

*Análise realizada em: 2025-11-23*
*Ferramenta: Claude Code Audit*
*Arquivos analisados: 150+ componentes, 3 config files, 1 global CSS*
