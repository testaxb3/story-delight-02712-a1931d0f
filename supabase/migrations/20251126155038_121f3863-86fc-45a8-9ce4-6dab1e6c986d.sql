-- Create DISTRACTED Public Behavior script: Wandered off in store
INSERT INTO public.scripts (
  title,
  category,
  profile,
  age_min,
  age_max,
  difficulty,
  duration_minutes,
  the_situation,
  what_doesnt_work,
  strategy_steps,
  why_this_works,
  what_to_expect,
  common_variations,
  parent_state_needed,
  tags,
  emergency_suitable
) VALUES (
  'Wandered off in store - found 3 aisles away completely absorbed in something shiny',
  'Public Behavior',
  'DISTRACTED',
  4,
  9,
  'Moderate',
  5,
  'Shopping no sábado de manhã, supermercado movimentado. Você pediu pra ele ficar do seu lado enquanto pega itens da lista. Ele concordou, estava segurando o carrinho.

Você se virou por **8 segundos** pra pegar o leite da prateleira alta.

Quando olha de volta: carrinho vazio, filho sumiu.

**Pânico absoluto.** Você grita o nome dele, nada. Corre pelos corredores, coração na garganta, mãos tremendo no celular pensando se deve ligar pra segurança.

Encontra ele no corredor de brinquedos, **COMPLETAMENTE absorvido** em uma caixa de Lego, virando e revirando, lendo cada detalhe da embalagem como se fosse um mapa do tesouro.

Ele não ouviu você gritar. Não percebeu que se separou. Genuinamente confuso quando você aparece ofegante: "O quê? Eu só tava olhando..."',
  '**❌ GRITAR/PUNIR NA HORA**

Ele não entende por que você está com raiva - na cabeça dele, ele só estava olhando algo interessante. Seu cérebro literalmente não registrou que ele se afastou. A bronca cria vergonha, não aprendizado.


**❌ "EU TE DISSE PRA FICAR DO MEU LADO!"**

Ele CONCORDOU e TENTOU. Mas a distração venceu. Não foi desobediência intencional - foi o cérebro DISTRACTED fazendo o que faz: ser capturado por estímulos interessantes. Culpá-lo por algo neurológico não funciona.


**❌ EXIGIR QUE ELE "PRESTE MAIS ATENÇÃO"**

O cérebro dele não funciona assim. Atenção não é uma escolha consciente que ele pode "ligar". É como pedir pra alguém míope "enxergar melhor" - o problema é estrutural, não motivacional.',
  '[
    {
      "step_number": 1,
      "step_title": "Âncora Física Antes de Entrar",
      "step_explanation": "ANTES de entrar na loja, estabelecer regra física clara que cria lembrete sensorial constante. O cérebro DISTRACTED precisa de âncora TANGÍVEL, não verbal. Dar FUNÇÃO ativa usa o hiperfoco a seu favor.",
      "what_to_say_examples": [
        "Sua mão fica no carrinho OU no meu bolso. Escolhe qual.",
        "Você é o guardião da lista - preciso de você pra achar as coisas. Segura aqui.",
        "Missão: sua mão não solta o carrinho até a gente pagar. Consegue?"
      ]
    },
    {
      "step_number": 2,
      "step_title": "Check-ins de 60 Segundos",
      "step_explanation": "A cada minuto, fazer contato visual + toque leve + pergunta simples. Isso ''reinicia'' o foco dele ANTES que a distração vença completamente. Working memory precisa ser ''refrescada'' constantemente.",
      "what_to_say_examples": [
        "[Toca no ombro] Ei, ainda tá comigo? Próximo item é banana.",
        "[Toca aqui - high five] O que a gente já achou? Conta pra mim.",
        "[Olho no olho] Ó, to pegando isso aqui. Você segura o carrinho, ok?"
      ]
    },
    {
      "step_number": 3,
      "step_title": "Resposta Quando Acontece (Sem Pânico Visível)",
      "step_explanation": "Quando encontrar: PRIMEIRO respirar, controlar seu medo. Toque no ombro, abaixar na altura dele, falar calmo. NÃO começar com bronca - começar com reconexão. Ele precisa associar ''me perdi'' com ''papai/mamãe me acha com calma'', não com ''sou uma pessoa ruim''.",
      "what_to_say_examples": [
        "[Toca no ombro, respira] Ei, eu te achei. Você tá bem?",
        "Uau, isso parece interessante. Seu cérebro te trouxe pra cá né? Vamos voltar.",
        "[Abaixa na altura] Ó, quando a gente se separa eu fico preocupado. Vamos tentar de novo com a mão no carrinho?"
      ]
    }
  ]'::jsonb,
  'O cérebro DISTRACTED tem déficit de **working memory** - ele literalmente "esquece" que estava com você quando algo captura atenção. Não é rebeldia, é neurologia.

**Âncora física** (mão no carrinho) cria lembrete SENSORIAL constante que o córtex pré-frontal fraco não consegue manter sozinho.

**Check-ins frequentes** previnem que a distração "sequestre" a atenção por tempo demais. Você está funcionando como o "sistema de alerta" externo dele.

**Resposta calma** evita que ele associe "explorar" com "sou uma pessoa ruim". Vergonha não ensina segurança - conexão + estrutura sim.

**Dar função ativa** (guardar lista, empurrar carrinho) usa o hiperfoco a seu FAVOR - quando ele tem "missão", o cérebro fica ancorado.',
  '{
    "first_30_seconds": "Ele pode nem perceber que você estava preocupado. Vai estar genuinamente confuso com sua reação intensa.",
    "by_90_seconds": "Com âncora física estabelecida, ele vai precisar de lembretes verbais mas ficará conectado ao carrinho/você.",
    "by_2_minutes": "Check-ins se tornam naturais para ambos - ele pode até começar a PEDIR função (''Posso segurar isso?'').",
    "dont_expect": [
      "Que ele nunca mais se distraia - o objetivo é REDUZIR frequência, não eliminar",
      "Que ele ''aprenda'' depois de 1 vez - working memory não melhora com bronca",
      "Que funcione em TODAS as lojas - lugares muito estimulantes (shopping com luzes/sons) vão precisar de âncora mais forte"
    ],
    "this_is_success": "Ele consegue completar uma ida rápida ao mercado (15-20 minutos) sem se perder. Pode precisar de 2-3 lembretes verbais, mas responde quando você chama."
  }'::jsonb,
  '[
    {
      "variation_scenario": "E se ele se solta do carrinho e corre?",
      "variation_response": "Pausar tudo. Não continuar comprando. Abaixar na altura dele: ''Precisamos da âncora de volta antes de continuar. Mão no carrinho ou no bolso?'' Se recusar, sair da loja (mesmo que lista incompleta). Estrutura precisa ser consistente."
    },
    {
      "variation_scenario": "E se ele reclama que é ''bebê'' ficar de mão dada?",
      "variation_response": "Oferecer alternativas de ''responsabilidade'': carregar item específico que você precisa (''Você segura o macarrão - é SUPER importante''), empurrar o carrinho, ser o ''scanner'' de preços (''Você confere se tá dentro do orçamento'')."
    },
    {
      "variation_scenario": "E em lugares sem carrinho (shopping, parque)?",
      "variation_response": "Âncora pode ser: alça da sua mochila, pulseira de identificação com seu número, ou ''missão'' visual específica (''Você precisa avistar a próxima loja de roupa vermelha e me avisar''). Hiperfoco vira aliado."
    }
  ]'::jsonb,
  'Preparação prévia, não reação posterior. Aceitar que a distração VAI acontecer - seu trabalho é criar sistemas que minimizem impacto, não esperar que ele "aprenda a prestar atenção". Respirar fundo antes de entrar na loja.',
  ARRAY['wandering', 'getting lost', 'store', 'shopping', 'supermarket', 'attention', 'focus', 'safety', 'public', 'hyperfocus', 'distraction'],
  false
);