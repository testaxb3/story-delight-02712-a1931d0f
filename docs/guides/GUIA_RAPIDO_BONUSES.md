# Guia Rápido - Painel de Bonuses

## Como Acessar

1. Faça login como Admin
2. Vá para a página `/admin`
3. Click na tab **"Bonuses"** (ícone de presente 🎁)

---

## Ações Rápidas

### ➕ Criar Novo Bonus

1. Click em **"Add New Bonus"**
2. Preencha os campos obrigatórios:
   - **Title**: Título do bonus
   - **Description**: Descrição detalhada
   - **Category**: Escolha entre video, ebook, pdf, tool, template, session
3. Campos opcionais:
   - **Thumbnail URL**: Link da imagem
   - **Duration**: Tempo (ex: "45 min")
   - **Tags**: Separadas por vírgula (ex: "Neuroscience, ADHD")
   - **View URL**: Link para visualizar (ex: "/videos")
   - **Download URL**: Link para download
4. Marque checkboxes se necessário:
   - ☐ **Locked**: Bonus trancado (precisa unlock requirement)
   - ☐ **Mark as New**: Mostra badge "NEW"
   - ☐ **Completed**: Marca como completado
5. Click **"Create Bonus"**

**Dica**: Use o botão "Show" para ver preview em tempo real!

---

### ✏️ Editar Bonus

1. Encontre o bonus na tabela
2. Click no ícone de **lápis (✏️)**
3. Modifique os campos desejados
4. Click **"Update Bonus"**

---

### 🗑️ Deletar Bonus

**Deletar 1 item**:
1. Click no menu "⋮" do bonus
2. Click em **"Delete"**
3. Confirme a ação

**Deletar múltiplos**:
1. Marque os checkboxes dos bonuses
2. Click em **"Delete Selected (N)"**
3. Confirme a ação

---

### 🔒 Trancar/Destrancar

1. Click no ícone de **cadeado (🔒/🔓)**
2. O status alterna instantaneamente
3. Se trancar, adicione "Unlock Requirement" no formulário

---

### 👁️ Visualizar Preview

1. Click no menu "⋮" do bonus
2. Click em **"Preview"**
3. Veja como aparece para os usuários

---

### 📋 Duplicar Bonus

1. Click no menu "⋮" do bonus
2. Click em **"Duplicate"**
3. Cópia criada automaticamente com "(Copy)" no título

---

## Filtros e Busca

### 🔍 Buscar
1. Click em **"Filters"**
2. Digite no campo **"Search"**
3. Busca em título, descrição e tags

### 🏷️ Filtrar por Categoria
1. Click em **"Filters"**
2. Selecione categoria no dropdown
3. Opções: All, Video, Ebook, PDF, Tool, Template, Session

### 🔤 Ordenar
1. Click em **"Filters"**
2. Selecione **"Sort By"**:
   - Title (A-Z)
   - Category
   - Newest First
   - Locked First

### 🧹 Limpar Filtros
Click em **"Clear Filters"**

---

## Export e Import

### 📥 Export (Baixar todos os bonuses)

1. Click em **"Export"**
2. Arquivo JSON baixado automaticamente
3. Nome: `nep-bonuses-[timestamp].json`

**Uso**: Backup ou transferir para outro ambiente

### 📤 Import (Importar bonuses)

1. Click em **"Import"**
2. Cole o JSON válido no campo
3. Click em **"Import"**

**Formato esperado**:
```json
[
  {
    "title": "Título do Bonus",
    "description": "Descrição completa",
    "category": "video",
    "locked": false,
    "tags": ["Tag1", "Tag2"]
  }
]
```

---

## Resetar Dados

⚠️ **ATENÇÃO**: Deleta todos os bonuses customizados!

1. Click em **"Reset"**
2. Confirme: "Reset all bonuses to mock data?"
3. Bonuses resetados para dados originais (mockBonusesData)

---

## Dashboard de Estatísticas

No topo da página, você vê:

- **Total**: Total de bonuses
- **Unlocked**: Bonuses desbloqueados
- **Locked**: Bonuses trancados
- **New**: Bonuses marcados como novos
- **Videos**: Quantidade de vídeos
- **PDFs**: Quantidade de PDFs
- **Other**: Outros tipos (ebook, tool, template, session)

---

## Categorias e Cores

Cada categoria tem cor e ícone específicos:

| Categoria  | Ícone        | Cor              |
|------------|--------------|------------------|
| Video      | ▶️ Play      | 🔴 Red          |
| Ebook      | 📖 BookOpen  | 🔵 Blue         |
| PDF        | 📄 FileText  | 🟢 Emerald      |
| Tool       | 🔧 Wrench    | 🟣 Purple       |
| Template   | 📄 FileText  | 🟣 Violet       |
| Session    | ⏰ Clock     | 🟠 Orange       |

---

## Status Badges

Na tabela, você verá badges indicando:

- 🔒 **Locked**: Bonus trancado
- ⭐ **New**: Bonus novo
- ✅ **Completed**: Bonus completado
- **Active**: Bonus ativo (sem badges especiais)

---

## Dicas Profissionais

### 📝 Títulos Descritivos
Use títulos claros e específicos:
- ✅ "NEP Foundation: Understanding Your Child's Brain"
- ❌ "Video 1"

### 🏷️ Tags Estratégicas
Use tags para facilitar busca:
- Perfis: "INTENSE", "DISTRACTED", "DEFIANT"
- Tópicos: "Neuroscience", "Sleep", "Homework"
- Tipo: "Fundamentals", "Advanced", "Crisis"

### 🖼️ Thumbnails Profissionais
Use imagens de alta qualidade do Unsplash:
```
https://images.unsplash.com/photo-[id]?w=800&auto=format&fit=crop
```

### 🔗 URLs Consistentes
- View URL para páginas internas: `/videos`, `/ebook`
- Download URL para arquivos externos: URLs completas

### 🔒 Unlock Requirements Claros
Seja específico sobre como desbloquear:
- ✅ "Complete the 30-day challenge"
- ✅ "Refer 3 friends or reach Mastery level"
- ❌ "Do stuff"

---

## Atalhos de Teclado

(Planejado para versão futura)
- `Ctrl/Cmd + N`: Novo bonus
- `Ctrl/Cmd + F`: Focar em search
- `Ctrl/Cmd + E`: Export
- `Delete`: Deletar selecionados

---

## Solução de Problemas

### Bonuses não aparecem?
1. Click em "Reset" para carregar dados mock
2. Verifique o console do navegador (F12)
3. Limpe filtros

### Form não salva?
1. Verifique se Title e Description estão preenchidos
2. Verifique se Category está selecionada
3. Veja mensagens de erro no topo do form

### Import falha?
1. Valide o JSON em jsonlint.com
2. Verifique se tem os campos obrigatórios:
   - `title`
   - `description`
   - `category`
3. Use o Export como referência de formato

### Estatísticas erradas?
1. Refresh a página (F5)
2. Click em "Reset" e reimporte seus dados

---

## FAQ

**P: Onde os dados são salvos?**
R: LocalStorage do navegador (chave: `nep_bonuses_data`). Futuro: Supabase database.

**P: Posso perder meus bonuses?**
R: Sim, se limpar cache/localStorage. Sempre faça Export como backup!

**P: Quantos bonuses posso criar?**
R: Ilimitado (limitado apenas pelo localStorage do navegador, ~5-10MB).

**P: Como compartilhar bonuses entre admins?**
R: Use Export/Import JSON.

**P: Posso adicionar imagens customizadas?**
R: Sim, cole a URL da imagem no campo "Thumbnail URL".

**P: O que é "View URL"?**
R: Link para onde o usuário vai ao clicar em "View Now" no bonus.

**P: Diferença entre Locked e Completed?**
R:
- **Locked**: Bonus ainda não disponível (precisa unlock)
- **Completed**: Usuário já completou este bonus

---

## Próximos Passos Recomendados

1. ✅ **Organize os bonuses existentes**
   - Adicione thumbnails profissionais
   - Padronize tags
   - Configure unlock requirements

2. ✅ **Crie categorias lógicas**
   - Videos fundamentais vs avançados
   - PDFs por perfil (INTENSE, DISTRACTED, DEFIANT)
   - Tools por funcionalidade

3. ✅ **Planeje progressão**
   - Bonuses iniciais: unlocked
   - Bonuses intermediários: require progress
   - Bonuses avançados: require mastery

4. ✅ **Backup regular**
   - Export JSON semanalmente
   - Salve em local seguro
   - Documente estrutura

---

**Precisa de ajuda?**
Consulte o arquivo `BONUSES_ADMIN_PANEL.md` para documentação técnica completa.

---

**Versão**: 1.0.0
**Última Atualização**: 2025-01-12
