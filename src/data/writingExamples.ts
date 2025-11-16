export interface WritingExample {
  title: string;
  bad: string;
  good: string;
  why: string;
}

export const writingGuidelines = {
  do: [
    'Escreva como se fosse um amigo experiente dando conselhos práticos',
    'Use frases curtas e diretas',
    'Valide sentimentos antes de dar soluções',
    'Admita que parenting é difícil',
    'Use humor leve onde apropriado',
    'Inclua detalhes específicos e reais',
    'Termine cada seção com um action step claro'
  ],
  dont: [
    'Soar como livro acadêmico',
    'Usar jargão excessivo',
    'Ser condescendente ("Querido pai...")',
    'Fazer promessas irreais ("Seu filho nunca mais...")',
    'Usar linguagem genérica de IA ("É importante notar que...")',
    'Usar exemplos genéricos ("João, 5 anos")',
    'Deixar pais sem próximo passo concreto'
  ],
  aiPhrases: [
    '"É importante notar que..."',
    '"Devemos considerar..."',
    '"Querido pai/mãe..."',
    '"Você pode tentar..."',
    '"Estudos mostram que..."',
    '"É essencial que..."',
    '"Pesquisas indicam que..."',
    '"É fundamental entender..."'
  ]
};

export const writingExamples: WritingExample[] = [
  {
    title: 'Abertura de Capítulo',
    bad: `É importante estabelecer uma rotina consistente para seu filho. Pesquisas mostram que crianças se beneficiam de estrutura e previsibilidade. Devemos considerar as necessidades individuais de cada criança ao implementar uma rotina.`,
    good: `Look, I know you've heard "establish a routine" a million times. But here's what nobody tells you: routines fail with neurodivergent kids because their brains work differently. Let me show you what actually works when you're 10 minutes from being late (again).`,
    why: 'A versão boa: (1) Valida frustração, (2) Explica POR QUE falha, (3) Promete solução prática, (4) Usa linguagem real e direta'
  },
  {
    title: 'Explicando Neurociência',
    bad: `Estudos neurológicos indicam que o córtex pré-frontal de crianças neurodivergentes apresenta desenvolvimento atípico, o que impacta a regulação emocional e o controle de impulsos. É essencial compreender essas diferenças neurobiológicas.`,
    good: `Your INTENSE child's brain has a louder alarm system than other kids. When they get upset, it's like their brain's fire alarm goes off for a candle—not because they're dramatic, but because their brain genuinely perceives bigger threats. This is why "calm down" never works.`,
    why: 'A versão boa: (1) Usa metáfora simples, (2) Explica comportamento observável, (3) Remove culpa, (4) Conecta com solução'
  },
  {
    title: 'Dando Instruções Práticas',
    bad: `Você pode tentar implementar uma estratégia de validação emocional seguida de redirecionamento comportamental. É importante manter a calma e utilizar uma linguagem clara e apropriada para a idade.`,
    good: `When your child starts melting down, do this:\n\n1. Get low (eye level)\n2. Say: "I see you're really mad"\n3. Wait 3 seconds\n4. Then: "Mad AND we still need shoes on"\n\nThat's it. No explaining. No reasoning. Just connect, validate, command.`,
    why: 'A versão boa: (1) Passos numerados claros, (2) Script exato, (3) Timing específico, (4) Remove complexidade'
  },
  {
    title: 'Contando Exemplo Real',
    bad: `João, 5 anos, tinha dificuldade com transições. Seus pais implementaram uma rotina visual e observaram melhorias significativas no comportamento.`,
    good: `Sarah's 6-year-old DEFIANT son would throw his shoes at her every single morning. She tried charts, rewards, consequences—nothing worked. Until she gave him a choice: "Red shoes or blue shoes?" He picked blue, put them on himself. Not because the shoes were magic, but because HE chose them. That's how DEFIANT brains work.`,
    why: 'A versão boa: (1) Detalhes específicos (idade, comportamento exato), (2) Mostra tentativas que falharam, (3) Explica O QUE funcionou E POR QUÊ, (4) Conecta com conceito maior'
  },
  {
    title: 'Lidando com Falhas',
    bad: `É normal que nem todas as estratégias funcionem imediatamente. Persistência e consistência são fundamentais para o sucesso a longo prazo.`,
    good: `This won't work every time. Some mornings you'll still be late, still yelling, still questioning everything. That's not failure—that's normal. What matters is that you have ONE tool that works 60% of the time instead of zero tools that work 0% of the time. That's progress.`,
    why: 'A versão boa: (1) Expectativas realistas, (2) Valida a dificuldade, (3) Redefine "sucesso", (4) Oferece perspectiva'
  },
  {
    title: 'Chamada à Ação',
    bad: `Recomenda-se que você pratique essas técnicas regularmente para obter melhores resultados. A implementação gradual pode ser benéfica.`,
    good: `Try this ONCE tomorrow morning. Not the whole system—just the choice part. "Red shirt or blue shirt?" See what happens. Then come back and read chapter 4.`,
    why: 'A versão boa: (1) Ação específica, (2) Baixa barreira, (3) Timing claro, (4) Próximo passo definido'
  }
];

export const calloutGuidelines = {
  note: {
    when: 'Informações críticas que mudam perspectiva ou evitam erro comum',
    example: `> [!NOTE] The Real Problem
> Traditional morning routines fail with neurodivergent kids because they require executive function skills these brains don't have yet. You're not asking too much—you're asking in the wrong way.`
  },
  tip: {
    when: 'Atalhos práticos, truques rápidos, hacks que economizam tempo',
    example: `> [!TIP] Quick Win
> Set a 2-minute timer instead of saying "hurry up." Neurodivergent kids respond better to concrete time than abstract pressure.`
  },
  warning: {
    when: 'Erros comuns que pioram situação ou armadilhas a evitar',
    example: `> [!WARNING] Don't Do This
> Never use time-outs during sensory overload with INTENSE kids. Their nervous system is already maxed out—isolation makes it worse, not better.`
  },
  science: {
    when: 'Neurociência explicada de forma simples que ajuda entender O POR QUÊ',
    example: `> [!SCIENCE] Why This Works
> DEFIANT brains have stronger autonomy circuits. When you give choices, you satisfy their need for control WITHOUT giving up your authority. Both brains win.`
  }
};

export const qualityChecklist = {
  content: [
    { item: 'Resolve problema ESPECÍFICO (não genérico)?', critical: true },
    { item: 'Pais conseguem implementar HOJE?', critical: true },
    { item: 'Inclui scripts NEP prontos?', critical: true },
    { item: 'Tem backup plans para quando falhar?', critical: false },
    { item: 'Exemplos são REAIS e detalhados?', critical: false },
    { item: 'Valida sentimentos antes de dar solução?', critical: true }
  ],
  writing: [
    { item: 'Linguagem soa como pessoa real? (teste: leia em voz alta)', critical: true },
    { item: 'SEM frases de IA? (ex: "É importante notar que...")', critical: true },
    { item: 'Tom é empático mas não condescendente?', critical: true },
    { item: 'Parágrafos curtos (3-5 linhas máximo)?', critical: false },
    { item: 'Usa exemplos específicos (não "João, 5 anos")?', critical: false }
  ],
  value: [
    { item: 'Passa no "7AM Chaos Test"? (funciona quando tudo está caótico?)', critical: true },
    { item: 'Ensina algo NOVO (não repete o óbvio)?', critical: true },
    { item: 'Inclui neurociência em linguagem simples?', critical: false },
    { item: 'Pais sentem que "alguém finalmente me entende"?', critical: true }
  ],
  structure: [
    { item: '7-10 capítulos (800-1200 palavras cada)?', critical: false },
    { item: 'Cada capítulo termina com action step claro?', critical: true },
    { item: 'Usa blocos [!NOTE], [!TIP], [!WARNING], [!SCIENCE]?', critical: false },
    { item: 'Inclui Quick Reference no final?', critical: false },
    { item: 'Formatação Markdown correta? (## CHAPTER X:)', critical: true }
  ],
  redFlags: [
    { item: 'Promessas irreais? ("Seu filho nunca mais...")', critical: true },
    { item: 'Muito acadêmico? (linguagem de paper científico)', critical: true },
    { item: 'Genérico? (poderia ser sobre qualquer criança)', critical: true },
    { item: 'Sem exemplos práticos? (só teoria)', critical: true },
    { item: 'Condescendente? ("Querido pai...")', critical: true }
  ]
};

export const templateStructure = {
  sevenChapter: {
    title: 'Template Base (7 Capítulos)',
    chapters: [
      {
        number: 1,
        title: '[O Problema Real]',
        content: 'Hook emocional + validação + "não está sozinho"',
        wordCount: '800-1000'
      },
      {
        number: 2,
        title: '[A Ciência por Trás]',
        content: 'Neurociência simples explicando POR QUÊ acontece',
        wordCount: '900-1100'
      },
      {
        number: 3,
        title: '[O Framework]',
        content: 'Estrutura principal do ebook (3 fases, 5 passos, etc.)',
        wordCount: '1000-1200'
      },
      {
        number: 4,
        title: '[Scripts e Exemplos Práticos]',
        content: 'Frases NEP + casos reais + como aplicar',
        wordCount: '1100-1300'
      },
      {
        number: 5,
        title: '[Quando Tudo Dá Errado]',
        content: 'Backup plans + troubleshooting realista',
        wordCount: '800-1000'
      },
      {
        number: 6,
        title: '[Success Stories]',
        content: 'Exemplos reais (não perfeitos) + lições aprendidas',
        wordCount: '700-900'
      },
      {
        number: 7,
        title: '[Quick Reference]',
        content: 'Cheat sheet visual + recursos adicionais',
        wordCount: '500-700'
      }
    ]
  }
};
