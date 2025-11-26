-- Insert DEFIANT School script: Monday morning school refusal
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
  'Monday morning school refusal - arms crossed, won''t get dressed, ''I''m NOT going and you can''t make me''',
  'School',
  'DEFIANT',
  5,
  11,
  'Hard',
  12,
  '6:47 da manhã, segunda-feira. Você acordou ele 3 vezes, na terceira ele gritou "ME DEIXA". Agora são 7:15, ele está de pijama ainda, sentado na cama de braços cruzados. "Eu não vou pra escola e você não pode me obrigar."

Você tem reunião às 8:30, precisa sair em 20 minutos. Cada segundo que passa, a pressão aumenta. Seu corpo está tenso, voz subindo, ameaças na ponta da língua. Ele percebe sua frustração e ESCALA - agora está sob o cobertor.',
  '**❌ COMMON MISTAKE #1: "Você VAI pra escola, ponto final!"**
Cria batalha de poder que ele está ESPERANDO. O cérebro dele interpreta isso como desafio direto, ativando modo defensivo total.


**❌ COMMON MISTAKE #2: Ameaças de consequências futuras**
"Se não for, não vai ter tela no fim de semana!" Ele não processa futuro quando está em modo defensivo - o cérebro está 100% no presente, na luta.


**❌ COMMON MISTAKE #3: Explicar racionalmente a importância da escola**
"A educação é importante para seu futuro..." Ele SABE. Não é sobre lógica. É sobre controle, poder, ansiedade que ele não consegue nomear.


**❌ COMMON MISTAKE #4: Arrastar/forçar fisicamente**
Pode funcionar UMA vez. Destrói completamente a confiança. Amanhã será 10x pior. Você ganha a batalha, perde a guerra.',
  '[
    {
      "step_number": 1,
      "step_title": "Sair do Cabo-de-Guerra",
      "step_explanation": "Parar de puxar a corda. Literalmente soltar.\n\nSentar no chão do quarto dele, respirar visivelmente. NÃO mencionar escola por 60 segundos completos. Seu corpo precisa sair de modo ataque antes que as palavras façam diferença.",
      "what_to_say_examples": [
        "Ei... parece que hoje está difícil.",
        "*silêncio, apenas respirando junto*",
        "Está bem, vou sentar aqui um segundo."
      ]
    },
    {
      "step_number": 2,
      "step_title": "Validar Sem Concordar",
      "step_explanation": "Nomear o que ele pode estar sentindo SEM ceder na decisão final.\n\nA validação desarma a defesa dele - ele esperava ataque, não compreensão. NÃO perguntar por quê - ele provavelmente não sabe. Oferecer escolha DENTRO da ida obrigatória, não sobre a ida.",
      "what_to_say_examples": [
        "Algo sobre hoje está pesado. Faz sentido não querer ir.",
        "Seu corpo está dizendo não, né? Eu vejo.",
        "Você quer levar seu desenho pra mostrar pro amigo? Ou prefere a mochila com o personagem favorito?"
      ]
    },
    {
      "step_number": 3,
      "step_title": "Movimento Micro",
      "step_explanation": "Não exigir vá se vestir - muito grande, muito direto.\n\nPedir UMA ação microscópica que ele possa fazer sem sentir que perdeu. Cada micro-sim reconstrói senso de controle dele. Manter tom neutro, sem urgência na voz mesmo que você esteja em pânico interno.",
      "what_to_say_examples": [
        "Consegue colocar só a meia? Só uma.",
        "Qual pé primeiro?",
        "Você pega a camisa ou eu pego?"
      ]
    }
  ]'::jsonb,
  'Crianças DEFIANT estão em modo "luta" constante - o cérebro interpreta demandas como ameaças à autonomia. Soltar a corda remove a resistência que ele estava empurrando contra.

Validação desarma porque ele esperava batalha. Quando você nomeia o sentimento sem julgar, o córtex pré-frontal dele pode começar a voltar online. Micro-ações bypassa o "NÃO" global com pequenos "sim" que reconstroem senso de agência.

Você ainda vai para escola - mas sem guerra. Ele não precisa admitir derrota para cooperar.',
  '{
    "first_30_seconds": "Ele pode ficar confuso ou suspeitoso quando você para de pressionar. Pode até escalar mais porque está testando se você desistiu.",
    "by_90_seconds": "A resistência física visível pode começar a diminuir - ombros relaxam levemente, olha pra você em vez de desviar.",
    "by_2_minutes": "Ele pode começar a se mover, mesmo reclamando. Perfeito - ele não precisa estar feliz.",
    "by_3_minutes": "Movimento real acontece - coloca uma meia, pega a mochila. Ainda resmungando, mas COOPERANDO.",
    "dont_expect": [
      "Que ele vá feliz ou admita que estava errado",
      "Que agradeça pela sua paciência",
      "Que isso resolva amanhã - cada manhã é nova",
      "Que você não fique atrasado - pode atrasar 10 minutos"
    ],
    "this_is_success": "Vocês chegam na escola sem gritos, sem forçar fisicamente, sem ameaças que você não pode cumprir. Mesmo que 10 minutos atrasados. A conexão foi preservada."
  }'::jsonb,
  '[
    {
      "variation_scenario": "E se realmente tiver algo acontecendo na escola (bullying, professor duro, ansiedade social)?",
      "variation_response": "Use este script para passar a manhã de hoje sem trauma adicional. Depois, quando ambos estiverem calmos (à noite, fim de semana), converse: Percebi que segundas são difíceis. O que está acontecendo na escola? Separe a crise imediata da investigação da causa."
    },
    {
      "variation_scenario": "E se eu realmente não puder me atrasar no trabalho hoje?",
      "variation_response": "Mande mensagem pro trabalho AGORA, antes de começar: Situação familiar, posso chegar 10-15 min atrasado? 5 minutos investidos aqui economizam 30 minutos de batalha que te atrasaria mais ainda. Proteja seu tempo desacelerando."
    },
    {
      "variation_scenario": "Isso acontece TODA segunda-feira, é padrão.",
      "variation_response": "Padrão semanal indica ansiedade antecipatória do fim de semana. Crie ritual de domingo à noite: preparar mochila juntos, escolher roupa, conversar sobre uma coisa boa que vai acontecer na segunda. Previne em vez de reagir."
    }
  ]'::jsonb,
  'Desacelerar para acelerar. Sua urgência é combustível puro para a resistência dele. Você chegará na escola - a questão é: com conexão ou com trauma? Escolha o caminho difícil agora que constrói confiança, não o caminho rápido que destrói.',
  ARRAY['school refusal', 'won''t go to school', 'morning battle', 'defiance', 'getting dressed', 'power struggle', 'control', 'monday morning', 'school anxiety'],
  false
);