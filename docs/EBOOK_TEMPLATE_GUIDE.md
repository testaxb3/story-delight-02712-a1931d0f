# Guia do Template de Ebook

## Visão Geral

O template de ebook foi criado para facilitar a criação de conteúdo formatado corretamente para o sistema de ebooks do Neurodivergent Parenting App.

## Características do Template

### ✅ Incluído no Template

1. **10 Capítulos de Exemplo**
   - Estrutura completa do início ao fim
   - Exemplos práticos de cada tipo de conteúdo
   - Fluxo lógico de um ebook educacional

2. **Instruções Inline**
   - Comentários HTML explicando cada seção
   - Dicas de formatação
   - Boas práticas de conteúdo

3. **Blocos Especiais**
   - `[!NOTE]` - Informações importantes
   - `[!TIP]` - Dicas práticas
   - `[!WARNING]` - Avisos e alertas
   - `[!SCIENCE]` - Fundamentos científicos

4. **Formatos Variados**
   - Listas ordenadas e não ordenadas
   - Tabelas
   - Checklists
   - Scripts de comunicação
   - Casos de estudo

5. **Checklist Final**
   - Verificação de formatação
   - Validação de conteúdo
   - Garantia de qualidade

## Como Usar o Template

### Passo 1: Baixar o Template

No Admin Panel:
1. Vá para **Bonuses** → **Novo Bônus**
2. Selecione categoria **"EBOOK"**
3. Aba **"Upload Markdown"**
4. Clique em **"Baixar Template"**
5. Salve o arquivo `ebook-template.md`

### Passo 2: Personalizar o Conteúdo

1. **Abra o arquivo** em um editor de texto (VS Code, Sublime, Notepad++)
2. **Leia as instruções** nos comentários HTML (não serão exibidos no ebook final)
3. **Substitua o conteúdo** de exemplo pelo seu próprio conteúdo
4. **Mantenha a estrutura** de capítulos e formatação

### Passo 3: Validar o Formato

Antes de fazer upload, verifique:

- [ ] Todos os capítulos começam com `## CHAPTER X:`
- [ ] Há pelo menos 5 capítulos
- [ ] Total de palavras > 500
- [ ] Callouts estão formatados corretamente
- [ ] Não há imagens quebradas (se usou imagens)
- [ ] Tabelas estão bem formatadas

### Passo 4: Fazer Upload

1. Volte ao Admin Panel
2. Faça upload do arquivo `.md` editado
3. Aguarde a validação automática
4. Revise o preview de capítulos
5. Clique em **"Processar e Criar Ebook"**

## Estrutura de Capítulos

### Formato Obrigatório

```markdown
## CHAPTER 1: Título do Capítulo
Subtítulo opcional (linha seguinte)

Conteúdo do capítulo...
```

**Importante:**
- Use exatamente `## CHAPTER X:` (case-insensitive)
- O número do capítulo não precisa ser sequencial
- Subtítulo é opcional mas recomendado

### Hierarquia de Títulos

```markdown
## CHAPTER X:     <- Capítulo principal (H2)
### Seção         <- Seção do capítulo (H3)
#### Subseção     <- Subseção (H4)
##### Detalhe     <- Detalhe específico (H5)
```

**Máximo:** H6 (6 níveis de profundidade)

## Blocos Especiais (Callouts)

### Tipos Disponíveis

#### 1. NOTE (Informação Importante)

```markdown
> [!NOTE] Título da Nota
> Conteúdo da nota importante.
> Pode ter múltiplas linhas.
```

**Quando usar:** Conceitos-chave, informações cruciais, lembretes importantes.

#### 2. TIP (Dica Prática)

```markdown
> [!TIP] Dica Útil
> Conteúdo da dica prática.
> Sugestões e truques.
```

**Quando usar:** Atalhos, truques, sugestões práticas, otimizações.

#### 3. WARNING (Aviso)

```markdown
> [!WARNING] Atenção!
> Conteúdo do aviso.
> Cuidados a tomar.
```

**Quando usar:** Erros comuns, armadilhas, coisas a evitar.

#### 4. SCIENCE (Base Científica)

```markdown
> [!SCIENCE] Fundamento Científico
> Explicação baseada em ciência.
> Estudos e pesquisas.
```

**Quando usar:** Explicações neurológicas, estudos científicos, pesquisas.

## Formatação de Texto

### Básica

```markdown
**Negrito**
*Itálico*
`Código inline`
~~Riscado~~
```

### Listas

```markdown
Não ordenadas:
- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2

Ordenadas:
1. Primeiro
2. Segundo
3. Terceiro
```

### Checklists

```markdown
- [ ] Item não marcado
- [x] Item marcado
- [ ] Outro item
```

### Links

```markdown
[Texto do link](https://url.com)
```

### Tabelas

```markdown
| Coluna 1 | Coluna 2 | Coluna 3 |
|----------|----------|----------|
| Dado 1   | Dado 2   | Dado 3   |
| Dado 4   | Dado 5   | Dado 6   |
```

## Scripts de Comunicação

Use blocos de código para scripts:

```markdown
### Script para [Situação]

```
"Frase exata do script"

[Pausa de 3 segundos]

"Segunda parte do script"
```

**Por que funciona:** Explicação aqui.
```

## Boas Práticas de Conteúdo

### 1. Seja Específico

❌ "Tente usar estratégias positivas"
✅ "Use o script: 'Vejo que você está frustrado. Vamos respirar juntos'"

### 2. Use Exemplos Reais

❌ "Isso funciona em várias situações"
✅ "Maria, 7 anos, perfil Intense. Situação: recusa para escovar dentes"

### 3. Inclua Ações Claras

❌ "Melhore a comunicação"
✅ "1. Abaixe-se ao nível dos olhos, 2. Fale calmamente, 3. Ofereça duas opções"

### 4. Tom Empático

❌ "Você está fazendo errado"
✅ "Muitos pais enfrentam isso. Vamos ajustar juntos"

### 5. Valide Experiências

❌ "É simples, basta fazer"
✅ "Sabemos que é desafiador. Cada pequeno passo conta"

## Comprimento Recomendado

### Por Seção

- **Capítulo completo:** 800-1.500 palavras
- **Seção (H3):** 200-400 palavras
- **Parágrafo:** 2-4 frases
- **Lista:** 3-7 itens

### Ebook Total

- **Mínimo:** 5.000 palavras
- **Ideal:** 8.000-15.000 palavras
- **Tempo de leitura:** 30-60 minutos
- **Capítulos:** 8-12 capítulos

## Checklist Pré-Upload

### Formatação ✅

- [ ] Capítulos seguem formato `## CHAPTER X:`
- [ ] Hierarquia de títulos correta (H2 a H6)
- [ ] Callouts formatados: `> [!TYPE] Título`
- [ ] Tabelas bem formatadas (se usadas)
- [ ] Listas com indentação correta

### Conteúdo ✅

- [ ] Mínimo de 5 capítulos
- [ ] Total > 500 palavras (ideal: 8.000+)
- [ ] Exemplos práticos incluídos
- [ ] Tom empático e encorajador
- [ ] Ações claras e específicas

### Qualidade ✅

- [ ] Revisão ortográfica completa
- [ ] Fluxo lógico entre capítulos
- [ ] Sem links quebrados
- [ ] Sem imagens quebradas (se usou)
- [ ] Conteúdo relevante ao tema

## Exemplos de Capítulos

### Capítulo Introdutório

```markdown
## CHAPTER 1: Introdução ao Tema
Um subtítulo envolvente que gera curiosidade

### Bem-vindo!

Parágrafo de boas-vindas caloroso e empático.

### O Que Você Vai Aprender

1. Objetivo claro 1
2. Objetivo claro 2
3. Objetivo claro 3

> [!NOTE] Importante
> Este ebook é baseado em [fundamento científico].
```

### Capítulo de Estratégias

```markdown
## CHAPTER 3: Estratégias Práticas

### Estratégia #1: [Nome]

#### Quando Usar
- Situação 1
- Situação 2

#### Como Implementar

1. **Passo 1:** Descrição
2. **Passo 2:** Descrição

> [!TIP] Dica
> Ajuste conforme necessário para seu contexto.
```

### Capítulo de Scripts

```markdown
## CHAPTER 4: Scripts de Comunicação

### Script #1: [Situação]

#### A Situação
Descrição detalhada da situação.

#### O Que Dizer

```
"Frase 1"
[Pausa]
"Frase 2"
```

#### Por Que Funciona
Explicação neurocientífica.
```

## Troubleshooting

### Problema: "Nenhum capítulo detectado"

**Causa:** Formato incorreto do título do capítulo

**Solução:** Use exatamente:
```markdown
## CHAPTER 1: Título
```

### Problema: Callouts não aparecem

**Causa:** Formatação incorreta

**Solução correta:**
```markdown
> [!NOTE] Título
> Conteúdo aqui
```

**Errado:**
```markdown
>[!NOTE] Título (sem espaço)
> [NOTE] Título (sem !)
```

### Problema: Tabela quebrada

**Causa:** Colunas desalinhadas

**Solução:** Certifique-se que todas as linhas têm o mesmo número de `|`

### Problema: Validação falha com >500 palavras

**Causa:** Possível erro de parsing

**Solução:**
1. Verifique se não há caracteres especiais no markdown
2. Remova comentários HTML se houver
3. Simplifique formatação complexa

## Recursos Adicionais

### No Admin Panel

- **Botão "Ver Guia"**: Abre modal com instruções visuais
- **Botão "Baixar Template"**: Download direto do template
- **Validação Automática**: Feedback em tempo real
- **Preview de Capítulos**: Veja como ficará antes de criar

### Suporte

Se tiver dúvidas:
1. Revise este guia
2. Veja os exemplos no template
3. Use o modal de ajuda no Admin Panel

## Conclusão

O template de ebook foi projetado para tornar a criação de conteúdo educacional simples e eficiente. Siga a estrutura, personalize o conteúdo, e crie ebooks profissionais para o Neurodivergent Parenting App! 🎉

---

**Última atualização:** 2025-11-13
**Versão do template:** 1.0
