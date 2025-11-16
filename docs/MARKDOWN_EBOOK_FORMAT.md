# Markdown Ebook Format Guide

Este documento descreve o formato Markdown suportado para ebooks no sistema.

## Estrutura de Capítulos

Os capítulos são separados por headings de nível 2 (`##`) ou nível 3 (`###`):

```markdown
## Chapter Title 1

Content for chapter 1...

## Chapter Title 2

Content for chapter 2...
```

## Formatação de Texto

### Básica
- **Bold**: `**texto em negrito**`
- *Italic*: `*texto em itálico*`
- ~~Strikethrough~~: `~~texto riscado~~`
- `Código inline`: `` `código` ``

### Links
Links são convertidos para texto simples (sem clique) pois ebooks são geralmente impressos ou em PDF:
```markdown
[Texto do link](https://url.com) → Será exibido apenas como "Texto do link" em negrito
```

## Listas

### Lista não ordenada
```markdown
- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2
- Item 3
```

### Lista ordenada
```markdown
1. Primeiro item
2. Segundo item
3. Terceiro item
```

## Callouts (Caixas de Destaque)

Use blockquotes com sintaxe especial para criar callouts:

### Tipos disponíveis

#### Remember (Nota/Lembrete)
```markdown
> [!NOTE]
> Este é um lembrete importante.
> Pode ter múltiplas linhas.

> [!REMEMBER]
> Mesmo efeito que NOTE.
```

#### Try This (Dica Prática)
```markdown
> [!TIP]
> Experimente esta técnica!

> [!TRY]
> Mesmo efeito que TIP.
```

#### Science Says (Explicação Científica)
```markdown
> [!SCIENCE]
> Pesquisas mostram que...
```

#### Important (Aviso/Atenção)
```markdown
> [!WARNING]
> Cuidado com isto!
```

## Script Boxes

Para scripts ou exemplos de diálogo, use blocos de código com linguagem `script`:

````markdown
```script
Parent: "I can see you're feeling frustrated."
Child: *calm breathing*
Parent: "Let's take a break together."
```
````

## Tabelas

Use a sintaxe GitHub Flavored Markdown:

```markdown
| Heading 1 | Heading 2 | Heading 3 |
|-----------|-----------|-----------|
| Cell 1    | Cell 2    | Cell 3    |
| Cell 4    | Cell 5    | Cell 6    |
```

## Imagens

```markdown
![Alt text da imagem](url-da-imagem.jpg)
```

As imagens são carregadas com lazy loading automático e otimização.

## Blocos de Código

### Código inline
Use crases simples: `` `código` ``

### Blocos de código
Use três crases:

````markdown
```javascript
function exemplo() {
  return "código de exemplo";
}
```
````

## Citações

Blockquotes regulares (sem `[!TYPE]`):

```markdown
> Esta é uma citação regular.
> Pode ter múltiplas linhas.
```

## Separadores Horizontais

```markdown
---
ou
***
```

## Exemplo Completo

```markdown
## Introduction to Sensory Regulation

Sensory regulation is a critical skill for **neurodivergent children**. This chapter explores proven strategies.

> [!SCIENCE]
> Research shows that sensory breaks can reduce meltdowns by up to 70%.

### Key Strategies

1. **Sensory breaks** - Schedule regular breaks
2. **Safe spaces** - Create calming environments
3. **Recognition** - Learn early warning signs

> [!TIP]
> Take photos of each activity and create a visual menu. Many neurodivergent children process visual information more quickly than verbal information.

#### Sample Script

```script
Parent: "I notice you're feeling overwhelmed."
Child: *shows distress*
Parent: "Let's go to your calm corner for a few minutes."
```

### Common Mistakes

- Not recognizing early signs
- Waiting too long to intervene
- Skipping sensory breaks

> [!WARNING]
> Never force a child into a sensory activity. Always offer choices and respect their boundaries.

## Summary

Remember these key points...
```

## Notas Técnicas

- O parser divide capítulos automaticamente por `##` ou `###`
- Callouts são preprocessados antes da renderização
- Links externos são desativados (convertidos para texto)
- Suporta **GitHub Flavored Markdown** (tabelas, strikethrough, task lists)
- Imagens têm lazy loading automático
- Todo conteúdo é sanitizado para segurança
