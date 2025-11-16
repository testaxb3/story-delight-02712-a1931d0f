export type EbookCategory = 
  | 'rotinas'
  | 'comportamento'
  | 'emocoes'
  | 'sleep'
  | 'school'
  | 'mealtime'
  | 'screen-time'
  | 'public-behavior';

export type ProfileType = 'intense' | 'distracted' | 'defiant' | 'universal';

export interface PromptTemplate {
  category: EbookCategory;
  profile: ProfileType;
  title: string;
  prompt: string;
}

export const ebookCategories: Record<EbookCategory, string> = {
  'rotinas': 'Rotinas (Matinais, Noturnas, Transições)',
  'comportamento': 'Comportamento (Birras, Desafio, Cooperação)',
  'emocoes': 'Emoções (Regulação, Ansiedade, Frustração)',
  'sleep': 'Sleep (Hora de Dormir, Resistência)',
  'school': 'School (Preparação, Lição de Casa)',
  'mealtime': 'Mealtime (Seletividade, Comportamento)',
  'screen-time': 'Screen Time (Desligamento, Limites)',
  'public-behavior': 'Public Behavior (Restaurantes, Lojas)'
};

export const profileTypes: Record<ProfileType, string> = {
  'intense': 'INTENSE Profile',
  'distracted': 'DISTRACTED Profile',
  'defiant': 'DEFIANT Profile',
  'universal': 'Universal (Todos os Perfis)'
};

const basePromptStructure = `CONTEXTO DO PROJETO:
Você está criando um ebook para o NEP (Neurodivergent Parenting) System, uma plataforma que ajuda pais de crianças neurodivergentes (INTENSE, DISTRACTED, DEFIANT) com scripts práticos baseados em neurociência.

PÚBLICO-ALVO:
- Pais esgotados que já tentaram "gentle parenting" e não funcionou
- Crianças 2-12 anos com perfis neurodivergentes
- Precisam de soluções PRÁTICAS, não teoria
- Querem sentir que não estão sozinhos

TOM E VOZ:
❌ NÃO use: "Querido pai/mãe...", "É importante lembrar que...", "Você pode tentar..."
✅ USE: Linguagem direta, empática mas real, como uma amiga experiente falando
✅ Escreva como PESSOA REAL, não como IA ou livro acadêmico

ESTRUTURA DO EBOOK:
Título: {{TITLE}}
Tema: {{THEME}}

CAPÍTULOS NECESSÁRIOS:
{{CHAPTERS}}

DIRETRIZES DE CONTEÚDO:
✅ Cada capítulo: 800-1200 palavras
✅ Use exemplos ESPECÍFICOS (não "João, 5 anos" - use detalhes reais)
✅ Inclua scripts NEP (Connection → Validation → Command)
✅ Adicione blocos [!NOTE], [!TIP], [!WARNING], [!SCIENCE] onde apropriado
✅ Sempre termine seções com "action step" claro
✅ Valide sentimentos antes de dar solução

CHECKLIST DE QUALIDADE:
- [ ] Linguagem soa como pessoa real? (leia em voz alta)
- [ ] Resolve problema específico? (não genérico)
- [ ] Pais conseguem implementar HOJE? (não "eventualmente")
- [ ] Inclui backup plans para quando falhar?
- [ ] Tom é empático mas não condescendente?

FORMATO DE SAÍDA:
Gere o ebook completo em Markdown seguindo o template do NEP System.
Use ## CHAPTER X: para cada capítulo.
Mantenha linguagem conversacional e prática.

IMPORTANTE:
- Este ebook será usado por pais em momentos de estresse
- Precisa funcionar na REALIDADE, não na teoria
- O teste final: "Um pai estressado consegue usar isto AGORA?"`;

export const promptTemplates: PromptTemplate[] = [
  // ROTINAS
  {
    category: 'rotinas',
    profile: 'universal',
    title: 'Rotinas que Funcionam na Realidade',
    prompt: basePromptStructure
      .replace('{{TITLE}}', '[SEU TÍTULO - ex: "The Morning Routine That Actually Works"]')
      .replace('{{THEME}}', 'Rotinas Matinais/Noturnas para Crianças Neurodivergentes')
      .replace('{{CHAPTERS}}', `1. **Why Your Routines Keep Failing** (problema real que eles vivem)
2. **The Science Behind Routine Resistance** (neurociência em 5º grau, não acadêmico)
3. **The 3-Phase Routine Framework** (estrutura prática)
4. **Scripts for Each Transition** (frases prontas NEP)
5. **When It All Falls Apart** (backup plans realistas)
6. **Success Stories** (exemplos reais, não perfeitos)
7. **Quick Reference Guide** (cheat sheet visual)`)
  },
  {
    category: 'rotinas',
    profile: 'defiant',
    title: 'Rotinas para Crianças DEFIANT',
    prompt: basePromptStructure
      .replace('{{TITLE}}', '[SEU TÍTULO - ex: "Making Routines Work for Your DEFIANT Child"]')
      .replace('{{THEME}}', 'Rotinas para Crianças DEFIANT (2-12 anos)')
      .replace('{{CHAPTERS}}', `1. **Why Power Struggles Destroy Routines** (o problema real do DEFIANT)
2. **The Autonomy Brain** (neurociência do controle)
3. **The Choice-Based Routine System** (dar escolhas sem perder estrutura)
4. **Connection Scripts That Disarm Resistance** (frases NEP específicas)
5. **Emergency Backup Plans** (quando tudo falha)
6. **Real DEFIANT Success Stories** (não editados, reais)
7. **Visual Routine Tools** (charts que funcionam)`)
  },
  {
    category: 'rotinas',
    profile: 'intense',
    title: 'Rotinas para Crianças INTENSE',
    prompt: basePromptStructure
      .replace('{{TITLE}}', '[SEU TÍTULO - ex: "Calming Routines for INTENSE Kids"]')
      .replace('{{THEME}}', 'Rotinas para Crianças INTENSE (2-12 anos)')
      .replace('{{CHAPTERS}}', `1. **Why Transitions Trigger Meltdowns** (o problema INTENSE)
2. **The Sensory Overload Brain** (neurociência da intensidade)
3. **The Slow-Transition Routine** (adaptações sensoriais)
4. **Calming Scripts for Big Feelings** (frases NEP para intensidade)
5. **Meltdown Recovery Plans** (o que fazer depois)
6. **INTENSE Success Stories** (exemplos reais)
7. **Sensory-Friendly Routine Charts** (ferramentas visuais)`)
  },
  {
    category: 'rotinas',
    profile: 'distracted',
    title: 'Rotinas para Crianças DISTRACTED',
    prompt: basePromptStructure
      .replace('{{TITLE}}', '[SEU TÍTULO - ex: "Focus-Friendly Routines for DISTRACTED Kids"]')
      .replace('{{THEME}}', 'Rotinas para Crianças DISTRACTED (2-12 anos)')
      .replace('{{CHAPTERS}}', `1. **Why Your Child Can't Stay On Track** (o problema DISTRACTED)
2. **The Attention-Switching Brain** (neurociência da distração)
3. **The One-Step-at-a-Time Routine** (chunks gerenciáveis)
4. **Redirection Scripts That Work** (frases NEP para foco)
5. **Visual Anchor Systems** (ferramentas de foco)
6. **DISTRACTED Success Stories** (exemplos reais)
7. **Step-by-Step Visual Guides** (checklists visuais)`)
  },

  // COMPORTAMENTO
  {
    category: 'comportamento',
    profile: 'universal',
    title: 'Comportamento: Além do Gentle Parenting',
    prompt: basePromptStructure
      .replace('{{TITLE}}', '[SEU TÍTULO - ex: "What to Do When Gentle Parenting Fails"]')
      .replace('{{THEME}}', 'Comportamento Desafiador em Crianças Neurodivergentes')
      .replace('{{CHAPTERS}}', `1. **Why Gentle Parenting Doesn't Work** (validação do problema)
2. **The Neurodivergent Behavior Brain** (ciência do comportamento)
3. **The NEP 3-Step System** (Connection → Validation → Command)
4. **Scripts for Common Behaviors** (birras, desafio, cooperação)
5. **When Behaviors Escalate** (backup plans)
6. **Real Behavior Transformations** (exemplos)
7. **Quick Behavior Response Guide** (cheat sheet)`)
  },
  {
    category: 'comportamento',
    profile: 'defiant',
    title: 'Defiance: Entendendo o Cérebro DEFIANT',
    prompt: basePromptStructure
      .replace('{{TITLE}}', '[SEU TÍTULO - ex: "Understanding the DEFIANT Brain"]')
      .replace('{{THEME}}', 'Comportamento Desafiador em Crianças DEFIANT')
      .replace('{{CHAPTERS}}', `1. **It's Not Just Defiance** (o que está realmente acontecendo)
2. **The Autonomy-Seeking Brain** (neurociência)
3. **The Choice Framework** (dar poder sem perder autoridade)
4. **De-escalation Scripts** (frases NEP para desafio)
5. **Power Struggle Recovery** (quando você já está no meio)
6. **DEFIANT Wins** (exemplos reais)
7. **Quick De-escalation Tools** (ferramentas rápidas)`)
  },

  // EMOÇÕES
  {
    category: 'emocoes',
    profile: 'intense',
    title: 'Regulação Emocional para Crianças INTENSE',
    prompt: basePromptStructure
      .replace('{{TITLE}}', '[SEU TÍTULO - ex: "Helping Your INTENSE Child Regulate Big Emotions"]')
      .replace('{{THEME}}', 'Regulação Emocional para Crianças INTENSE')
      .replace('{{CHAPTERS}}', `1. **When Feelings Are Too Big** (o problema INTENSE)
2. **The Emotional Intensity Brain** (neurociência das emoções)
3. **The Co-Regulation System** (você regula primeiro)
4. **Calming Scripts for Emotional Storms** (frases NEP)
5. **Emergency Regulation Tools** (quando está explodindo)
6. **INTENSE Emotion Success Stories** (exemplos)
7. **Emotion Regulation Toolkit** (ferramentas práticas)`)
  },

  // SLEEP
  {
    category: 'sleep',
    profile: 'universal',
    title: 'Sleep: Hora de Dormir Sem Guerra',
    prompt: basePromptStructure
      .replace('{{TITLE}}', '[SEU TÍTULO - ex: "Bedtime Without the Battle"]')
      .replace('{{THEME}}', 'Hora de Dormir para Crianças Neurodivergentes')
      .replace('{{CHAPTERS}}', `1. **Why Bedtime Is A War Zone** (o problema real)
2. **The Neurodivergent Sleep Brain** (ciência do sono)
3. **The Wind-Down System** (rotina que funciona)
4. **Bedtime Scripts** (frases NEP para sono)
5. **Resistance & Escape Plans** (quando não querem dormir)
6. **Sleep Success Stories** (exemplos reais)
7. **Bedtime Quick Reference** (guia rápido)`)
  },

  // SCHOOL
  {
    category: 'school',
    profile: 'universal',
    title: 'School: Sobrevivendo à Rotina Escolar',
    prompt: basePromptStructure
      .replace('{{TITLE}}', '[SEU TÍTULO - ex: "School Mornings & Homework That Don\'t End in Tears"]')
      .replace('{{THEME}}', 'Rotina Escolar para Crianças Neurodivergentes')
      .replace('{{CHAPTERS}}', `1. **Why School Is Harder for Neurodivergent Kids** (validação)
2. **The Executive Function Gap** (ciência das dificuldades escolares)
3. **The School Prep System** (preparação matinal)
4. **Homework Without Tears** (estratégias práticas)
5. **School Refusal & Resistance** (quando não querem ir)
6. **School Success Stories** (exemplos)
7. **School Survival Toolkit** (ferramentas)`)
  },

  // MEALTIME
  {
    category: 'mealtime',
    profile: 'universal',
    title: 'Mealtime: Alimentação Sem Drama',
    prompt: basePromptStructure
      .replace('{{TITLE}}', '[SEU TÍTULO - ex: "Mealtime Without the Drama"]')
      .replace('{{THEME}}', 'Alimentação para Crianças Neurodivergentes')
      .replace('{{CHAPTERS}}', `1. **Why Mealtime Is A Battleground** (o problema real)
2. **The Sensory Food Brain** (neurociência da seletividade)
3. **The Pressure-Free Eating System** (remover pressão)
4. **Mealtime Scripts** (frases NEP para comida)
5. **Food Refusal Strategies** (quando não querem comer)
6. **Mealtime Wins** (exemplos reais)
7. **Mealtime Quick Guide** (ferramentas práticas)`)
  },

  // SCREEN TIME
  {
    category: 'screen-time',
    profile: 'universal',
    title: 'Screen Time: Limites Sem Meltdowns',
    prompt: basePromptStructure
      .replace('{{TITLE}}', '[SEU TÍTULO - ex: "Screen Time Limits Without the Meltdown"]')
      .replace('{{THEME}}', 'Screen Time para Crianças Neurodivergentes')
      .replace('{{CHAPTERS}}', `1. **Why Screen Time Ends in Tears** (o problema)
2. **The Hyperfocus Screen Brain** (neurociência do engajamento)
3. **The Transition Warning System** (preparar para desligar)
4. **Screen-Off Scripts** (frases NEP)
5. **Meltdown Prevention Plans** (evitar explosões)
6. **Screen Success Stories** (exemplos)
7. **Screen Time Toolkit** (ferramentas práticas)`)
  },

  // PUBLIC BEHAVIOR
  {
    category: 'public-behavior',
    profile: 'universal',
    title: 'Public Behavior: Saídas Sem Estresse',
    prompt: basePromptStructure
      .replace('{{TITLE}}', '[SEU TÍTULO - ex: "Going Out Without the Drama"]')
      .replace('{{THEME}}', 'Comportamento em Público para Crianças Neurodivergentes')
      .replace('{{CHAPTERS}}', `1. **Why Public Outings Are Stressful** (o problema)
2. **The Sensory Overload in Public** (neurociência)
3. **The Public Prep System** (preparação antes de sair)
4. **Public Scripts** (frases NEP para locais públicos)
5. **Emergency Exit Plans** (quando precisa sair rápido)
6. **Public Success Stories** (exemplos)
7. **Public Outing Toolkit** (ferramentas para levar)`)
  }
];

export const getPromptByCategory = (category: EbookCategory, profile: ProfileType): PromptTemplate | undefined => {
  return promptTemplates.find(p => p.category === category && p.profile === profile);
};

export const getPromptsByCategory = (category: EbookCategory): PromptTemplate[] => {
  return promptTemplates.filter(p => p.category === category);
};
