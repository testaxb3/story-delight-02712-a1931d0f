# 🎨 GUIA DE DESIGN - COMO CRIAR SEUS EBOOKS

## 📚 3 Ebooks para Produzir

1. **How to Build Your Children's Routine** (30-40 páginas)
2. **How to Teach Your Child to Play Alone** (35-45 páginas)
3. **What Are You Afraid Of?** (40-50 páginas)

---

## 🎯 OPÇÃO 1: FIGMA (Recomendado - Gratuito)

### Por que Figma?
- ✅ Gratuito
- ✅ Online (não precisa instalar)
- ✅ Templates prontos
- ✅ Exporta PDF direto
- ✅ Fácil de usar

### Passo a Passo:

#### STEP 1: Criar Conta
1. Vá em: https://www.figma.com
2. Crie conta gratuita
3. Clique em "New Design File"

#### STEP 2: Configurar Documento
**Tamanho de Página:**
- Width: **2100px** (8.5 inches)
- Height: **2970px** (11 inches)
- Formato: A4 vertical

**Como configurar:**
1. Clique no canvas
2. Right panel → Frame
3. Custom → Digite 2100 x 2970

#### STEP 3: Criar Master Page (Template Base)

**Layout da Página:**
```
┌────────────────────────────────────┐
│  [Header/Logo]                    │  ← 150px do topo
│                                    │
│                                    │
│  CONTEÚDO AQUI                    │  ← Margens: 200px cada lado
│                                    │
│                                    │
│  [Número da página]               │  ← 100px da base
└────────────────────────────────────┘
```

**Elementos da Master Page:**
1. Logo/Brand (top-left, pequeno)
2. Número de página (bottom-center)
3. Linha decorativa (opcional)

---

## 🎨 PALETA DE CORES

### Cores Principais:

**Primary (Roxo/Purple):**
- Main: `#8B5CF6` (purple-500)
- Light: `#A78BFA` (purple-400)
- Dark: `#7C3AED` (purple-600)

**Secondary (Âmbar/Amber):**
- Main: `#F59E0B` (amber-500)
- Light: `#FCD34D` (amber-300)

**Neutral:**
- Background: `#FFFFFF` (white)
- Text Dark: `#1F2937` (gray-800)
- Text Light: `#6B7280` (gray-500)

**Accents:**
- Success/Green: `#10B981` (emerald-500)
- Warning/Red: `#EF4444` (red-500)
- Info/Blue: `#3B82F6` (blue-500)

### Quando Usar Cada Cor:

- **Títulos:** Purple Dark (`#7C3AED`)
- **Subtítulos:** Purple Main (`#8B5CF6`)
- **Body Text:** Gray Dark (`#1F2937`)
- **Captions:** Gray Light (`#6B7280`)
- **Highlights:** Amber (`#F59E0B`)
- **Boxes:** Purple Light background (`#A78BFA` 10% opacity)

---

## ✍️ FONTES

### Opção A: Fontes Google (Gratuitas)

**Para Títulos:**
- **Poppins Bold** (700) - Moderno, clean
- Alternativa: Montserrat Bold

**Para Corpo de Texto:**
- **Inter Regular** (400) - Legível
- Alternativa: Open Sans

**Para Destaques:**
- **Poppins SemiBold** (600)

### Como Adicionar no Figma:
1. Selecione texto
2. Right panel → Text → Font family
3. Digite "Poppins" ou "Inter"
4. Se não aparecer, clique em "More fonts" → Google Fonts

### Tamanhos de Fonte:

| Elemento | Fonte | Tamanho | Weight |
|----------|-------|---------|--------|
| Chapter Title | Poppins | 48px | Bold |
| Section Heading | Poppins | 36px | SemiBold |
| Subheading | Poppins | 28px | SemiBold |
| Body Text | Inter | 18px | Regular |
| Caption | Inter | 14px | Regular |
| Page Number | Inter | 12px | Regular |

---

## 📐 ESTRUTURA DAS PÁGINAS

### PÁGINA 1: CAPA

**Layout:**
```
┌────────────────────────────────────┐
│                                    │
│         [Logo/Brand]               │
│                                    │
│                                    │
│      📘 TÍTULO DO EBOOK            │
│      Grande, Bold, Centralizado    │
│                                    │
│      Subtítulo                     │
│      Menor, Light                  │
│                                    │
│                                    │
│      [Imagem Ilustrativa]          │
│      (ícone grande relacionado)    │
│                                    │
│      by Michelle Bottrell          │
│      Obedience Language            │
│                                    │
└────────────────────────────────────┘
```

**Exemplo Capa Ebook 1:**
- Título: "How to Build Your Children's Routine"
- Subtítulo: "The Visual System That Makes Kids Clean Up Without Being Asked"
- Ícone: 📋 ou ☀️ (grande, colorido)

---

### PÁGINA 2: TABLE OF CONTENTS

**Layout:**
```
┌────────────────────────────────────┐
│  📖 TABLE OF CONTENTS              │
│                                    │
│  1. Introduction ............... 3 │
│  2. Why Routines Fail ......... 5 │
│  3. The Technique ............. 8 │
│  ...                               │
│                                    │
└────────────────────────────────────┘
```

**Formatação:**
- Números alinhados à esquerda
- Página alinhada à direita
- Pontilhado entre eles

---

### PÁGINA 3+: CAPÍTULOS

**Layout Padrão:**

```
┌────────────────────────────────────┐
│  CHAPTER 1                         │  ← Small, Purple
│  Título do Capítulo                │  ← Large, Bold
│  ────────────────                  │  ← Linha decorativa
│                                    │
│  ### Subtítulo                     │  ← Medium, SemiBold
│                                    │
│  Parágrafo de texto normal         │
│  com espaçamento adequado.         │
│                                    │
│  ┌──────────────────────────────┐ │
│  │  💡 DESTAQUE/TIP             │ │  ← Box colorido
│  │  Texto importante aqui        │ │
│  └──────────────────────────────┘ │
│                                    │
│  Mais texto normal...              │
│                                    │
│                     [Página 5]     │  ← Bottom center
└────────────────────────────────────┘
```

---

## 🎁 ELEMENTOS VISUAIS

### 1. BOXES/CARDS

**Exemplo: Tip Box**
- Background: Purple 10% opacity
- Border: 2px solid Purple
- Border radius: 8px
- Padding: 20px
- Icon: 💡 (emoji grande antes do texto)

**Exemplo: Warning Box**
- Background: Red 10% opacity
- Border: 2px solid Red
- Icon: ⚠️

**Exemplo: Success Box**
- Background: Green 10% opacity
- Border: 2px solid Green
- Icon: ✅

### 2. LISTAS

**Com Emojis:**
```
✅ Item positivo
❌ Item negativo
💡 Dica
🎯 Importante
📝 Nota
```

**Com Números:**
```
1. Primeiro passo
2. Segundo passo
3. Terceiro passo
```

### 3. TABELAS

**Exemplo:**
```
┌──────────┬─────────┬──────────┐
│ Idade    │ Tempo   │ Tarefa   │
├──────────┼─────────┼──────────┤
│ 3-5      │ 20 min  │ Brincar  │
│ 6-8      │ 30 min  │ Ler      │
└──────────┴─────────┴──────────┘
```

**No Figma:**
- Use retângulos para células
- Alternee background (white/light gray)
- Border: 1px solid Gray

### 4. ÍCONES

**Onde Usar:**
- Início de capítulo (grande, colorido)
- Listas (pequeno, inline)
- Headers de boxes

**Fontes de Ícones Gratuitos:**
- Emojis nativos (copie/cole)
- Flaticon.com (PNG grátis)
- Icons8.com (SVG grátis)

---

## 📄 EXPORTAR PDF

### No Figma:

1. Selecione TODAS as páginas (Ctrl+A)
2. Right panel → Export
3. Format: **PDF**
4. Settings:
   - ✅ Include "id" in attribute
   - ✅ Outline text (para fontes funcionarem em qualquer device)
5. Click **Export**

**Resultado:** 1 arquivo PDF com todas as páginas

---

## 🎯 OPÇÃO 2: CANVA (Mais Fácil, Mas Pago)

### Vantagens:
- ✅ Super fácil de usar
- ✅ Templates prontos de ebooks
- ✅ Drag & drop

### Desvantagens:
- ❌ Precisa Canva Pro ($12.99/mês) para remover marca d'água
- ❌ Menos controle criativo

### Como Usar:

1. Acesse: https://www.canva.com
2. Search: "Ebook Template"
3. Escolha template profissional
4. Customize:
   - Troque cores para paleta acima
   - Cole conteúdo dos .md files
   - Adicione ícones/imagens
5. Download → PDF Print

---

## 🎯 OPÇÃO 3: Google Slides (Rápido e Simples)

### Vantagens:
- ✅ 100% gratuito
- ✅ Familiar (como PowerPoint)
- ✅ Colaboração fácil

### Desvantagens:
- ❌ Menos "profissional" que Figma
- ❌ Limitado em design

### Como Usar:

1. Abra Google Slides
2. New Presentation
3. Slide Size → Custom → 8.5" x 11"
4. Cada slide = 1 página do ebook
5. Cole conteúdo, formate
6. Download → PDF

---

## 📋 CHECKLIST DE PRODUÇÃO

### Para Cada Ebook:

- [ ] Capa com título + ícone
- [ ] Table of Contents
- [ ] Todos os capítulos formatados
- [ ] Boxes destacados (tips, warnings)
- [ ] Imagens/ícones relevantes
- [ ] Números de página em todas as páginas
- [ ] Espaçamento consistente
- [ ] Cores da paleta aplicadas
- [ ] Fontes corretas
- [ ] Exportado como PDF
- [ ] Testado em celular (PDF abre bem?)
- [ ] Testado em tablet

---

## 🎨 TEMPLATES PRONTOS (Recomendação)

Se não quiser fazer do zero:

### Figma Community Templates (Gratuitos):
1. Acesse: https://www.figma.com/community
2. Search: "ebook template"
3. Escolha um que goste
4. Duplicate to your files
5. Customize com seu conteúdo

**Recomendados:**
- "Modern Ebook Template" by DesignSense
- "Clean Ebook Design" by UIStore
- "Minimal Ebook Layout" by TemplateHub

---

## 💡 DICAS PROFISSIONAIS

### 1. Consistência é Rei
- Mesma fonte em TODO o ebook
- Mesmos tamanhos
- Mesmos espaçamentos
- Mesmos estilos de box

### 2. White Space é Seu Amigo
- NÃO encha páginas demais
- Deixe respiro visual
- Margens generosas

### 3. Hierarquia Visual Clara
- Título > Subtítulo > Corpo
- Use tamanho + peso + cor para diferenciar

### 4. Legibilidade
- Line height: 1.5x (150%)
- Paragraph spacing: 1.5x font size
- Contraste alto entre texto e fundo

### 5. Teste em Devices
- Abra PDF no celular
- Texto está legível?
- Cores ficaram boas?

---

## 📊 TIMELINE ESTIMADO

**Por Ebook:**
- Setup (primeira vez): 1 hora
- Design de 1 página: 10-15 min
- Ebook de 40 páginas: 8-10 horas total

**3 Ebooks Completos:**
- First-timer: 25-30 horas
- Depois de pegar prática: 15-20 horas

**Dica:** Faça 1 por semana. Em 3 semanas está pronto!

---

## 🎁 RECURSOS EXTRAS

### Imagens Gratuitas:
- Unsplash.com (fotos)
- Pexels.com (fotos)
- Undraw.co (ilustrações)

### Ícones Gratuitos:
- Flaticon.com
- Icons8.com
- Noun Project (alguns grátis)

### Inspiração:
- Dribbble.com (search "ebook design")
- Behance.net (search "ebook layout")

---

## ❓ FAQ

**P: Preciso saber design?**
R: Não! Use templates e copie layouts que você gosta.

**P: Quanto tempo leva?**
R: Primeiro ebook: 10 horas. Depois fica mais rápido.

**P: Qual ferramenta é melhor?**
R: Figma (gratuito, profissional). Ou Canva se quiser pagar.

**P: Preciso de imagens custom?**
R: Não. Emojis + ícones gratuitos funcionam bem.

**P: E se eu não gostar do resultado?**
R: Contrate designer no Fiverr ($50-$150 por ebook).

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ Escolha ferramenta (Figma recomendado)
2. ✅ Configure documento (2100x2970px)
3. ✅ Defina paleta de cores
4. ✅ Instale fontes (Poppins + Inter)
5. ✅ Crie template de página
6. ✅ Cole conteúdo do Ebook 1
7. ✅ Formate capítulo por capítulo
8. ✅ Adicione ícones/boxes
9. ✅ Exporte PDF
10. ✅ Repita para Ebooks 2 e 3

---

**Você consegue! 💪**

**Qualquer dúvida, me chame que eu ajudo mais!**

---

**© Michelle Bottrell - Obedience Language**
**Bonus Ebooks Design Guide**

🎨 **FIM DO GUIA** 🎨
