# Painel de Administração de Bonuses - Documentação Completa

## Visão Geral

Sistema completo de gerenciamento de bonuses (CRUD) integrado à página Admin da aplicação NEP System. Permite criar, editar, visualizar e remover bonuses com interface intuitiva e funcionalidades avançadas.

---

## Arquivos Criados/Modificados

### 1. **src/lib/bonusesService.ts** ✅
**Propósito**: Service layer para todas as operações CRUD de bonuses.

**Funcionalidades**:
- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Persistência em localStorage (preparado para Supabase)
- ✅ Bulk operations (deletar múltiplos)
- ✅ Toggle lock/unlock
- ✅ Duplicar bonuses
- ✅ Export/Import JSON
- ✅ Search e Filter
- ✅ Sort (por título, categoria, novos, locked)
- ✅ Estatísticas (total, locked, por categoria)

**Principais Funções**:
```typescript
getAllBonuses(): BonusData[]
getBonusById(id: string): BonusData | undefined
createBonus(bonus: Omit<BonusData, "id">): BonusData
updateBonus(id: string, updates: Partial<BonusData>): BonusData | null
deleteBonus(id: string): boolean
deleteBonuses(ids: string[]): number
toggleBonusLock(id: string): BonusData | null
duplicateBonus(id: string): BonusData | null
exportBonusesToJSON(): string
importBonusesFromJSON(jsonString: string): Result
searchBonuses(query: string, category?: string): BonusData[]
sortBonuses(bonuses: BonusData[], sortBy): BonusData[]
getBonusStats(): Stats
resetToMockData(): void
```

---

### 2. **src/components/Admin/AdminBonusesTab.tsx** ✅
**Propósito**: Componente principal da tab de gerenciamento de bonuses.

**Recursos**:
- ✅ Dashboard com estatísticas (total, locked, unlocked, new, por categoria)
- ✅ Barra de ações (Add, Bulk Delete, Export, Import, Reset)
- ✅ Filtros avançados (search, categoria, ordenação)
- ✅ Integração com BonusesTable e BonusFormModal
- ✅ Preview modal
- ✅ Import/Export JSON
- ✅ Toast notifications

**Estado Gerenciado**:
- Lista de bonuses
- Filtros (search, category, sortBy)
- Seleção múltipla
- Modals (form, preview, import, bulk delete)

---

### 3. **src/components/Admin/BonusesTable.tsx** ✅
**Propósito**: Tabela responsiva com todos os bonuses.

**Colunas**:
1. ☑️ Checkbox (seleção múltipla)
2. 🖼️ Thumbnail (imagem ou ícone da categoria)
3. 📝 Title + Description + Tags
4. 🏷️ Category (badge colorido)
5. 🔒 Status (Locked, New, Completed, Active)
6. ⚙️ Actions (Edit, Lock/Unlock, More ▼)

**Actions Disponíveis**:
- ✏️ Edit - Abre modal de edição
- 🔒/🔓 Toggle Lock - Tranca/Destranca
- 👁️ Preview - Visualiza como card
- 📋 Duplicate - Duplica o bonus
- 🗑️ Delete - Confirma e deleta

**Features**:
- ✅ Select all / Select individual
- ✅ Status badges visuais
- ✅ Dropdown menu com ações extras
- ✅ Confirmation dialog para delete
- ✅ Responsivo

---

### 4. **src/components/Admin/BonusFormModal.tsx** ✅
**Propósito**: Modal completo para criar/editar bonuses.

**Formulário**:
```typescript
// Campos obrigatórios
- Title * (text)
- Description * (textarea)
- Category * (select: video, ebook, pdf, tool, template, session)

// Campos opcionais
- Thumbnail URL (url)
- Duration (text: "45 min")
- File Size (text: "12 MB")
- Progress (number: 0-100%)
- Tags (comma-separated)
- View URL (text: "/ebook")
- Download URL (url)
- Unlock Requirement (textarea, se locked)

// Checkboxes
☐ Locked
☐ Mark as New
☐ Completed
```

**Features**:
- ✅ Live preview do card (toggle show/hide)
- ✅ Validação de campos obrigatórios
- ✅ Tag chips visualization
- ✅ Category-specific guidelines
- ✅ Responsivo (2 colunas: form | preview)
- ✅ Loading state

---

### 5. **src/pages/Admin.tsx** ✅
**Modificações**:
- ✅ Importado `AdminBonusesTab`
- ✅ Adicionado ícone `Gift` do lucide-react
- ✅ Atualizado state `counts` para incluir `bonuses`
- ✅ `fetchCounts()` agora busca contagem de localStorage
- ✅ TabsList ajustado para 8 colunas (grid-cols-8)
- ✅ Novo TabTrigger "Bonuses" com badge rosa
- ✅ Novo TabsContent para renderizar AdminBonusesTab

**Layout da Tab**:
```tsx
<TabsTrigger value="bonuses">
  <Gift className="w-5 h-5" />
  <span>Bonuses</span>
  <Badge>{counts.bonuses}</Badge>
</TabsTrigger>
```

---

## Estrutura de Dados

### BonusData Interface
```typescript
interface BonusData {
  id: string;                    // UUID gerado automaticamente
  title: string;                 // Obrigatório
  description: string;           // Obrigatório
  category: "video" | "ebook" | "tool" | "pdf" | "session" | "template";
  thumbnail?: string;            // URL da imagem
  duration?: string;             // "45 min"
  size?: string;                 // "12 MB"
  locked: boolean;               // Trancado ou não
  completed?: boolean;           // Usuário completou
  progress?: number;             // 0-100%
  isNew?: boolean;               // Badge "New"
  tags?: string[];               // ["Neuroscience", "ADHD"]
  viewUrl?: string;              // "/ebook" ou "/videos"
  downloadUrl?: string;          // URL para download
  requirement?: string;          // "Complete 30-day challenge"
}
```

---

## Fluxo de Uso

### 1. Criar Novo Bonus
1. Click em "Add New Bonus"
2. Preencher formulário (título, descrição, categoria obrigatórios)
3. Adicionar tags separadas por vírgula
4. Toggle "Show" para ver preview ao vivo
5. Opcionalmente marcar como Locked ou New
6. Click "Create Bonus"
7. ✅ Toast de sucesso + tabela atualizada

### 2. Editar Bonus
1. Click no botão ✏️ Edit na tabela
2. Modal abre com dados preenchidos
3. Modificar campos desejados
4. Ver preview em tempo real
5. Click "Update Bonus"
6. ✅ Toast de sucesso + tabela atualizada

### 3. Deletar Bonus
1. Click no menu "⋮" > Delete
2. Dialog de confirmação aparece
3. Click "Delete"
4. ✅ Bonus removido + toast de sucesso

### 4. Toggle Lock/Unlock
1. Click no ícone 🔒/🔓
2. ✅ Status alterna instantaneamente
3. Toast confirma ação

### 5. Preview Bonus
1. Click no menu "⋮" > Preview
2. Modal mostra card como aparece para usuários
3. Visualizar thumbnail, badges, tags, etc.

### 6. Duplicar Bonus
1. Click no menu "⋮" > Duplicate
2. ✅ Cópia criada com "(Copy)" no título
3. Marcada como "New" automaticamente

### 7. Bulk Delete
1. Selecionar múltiplos bonuses (checkboxes)
2. Click "Delete Selected (N)"
3. Dialog de confirmação
4. ✅ Todos deletados de uma vez

### 8. Export/Import
**Export**:
1. Click "Export"
2. ✅ Arquivo JSON baixado com todos os bonuses

**Import**:
1. Click "Import"
2. Colar JSON válido
3. Click "Import"
4. ✅ Bonuses importados (IDs novos gerados)

### 9. Reset to Mock Data
1. Click "Reset"
2. Confirmação: "Reset all bonuses to mock data?"
3. ✅ localStorage resetado para dados originais

---

## Filtros e Ordenação

### Search
- Busca em: title, description, tags
- Case-insensitive
- Real-time filtering

### Category Filter
- All Categories (padrão)
- Video
- Ebook
- PDF
- Tool
- Template
- Session

### Sort Options
- Title (A-Z)
- Category
- Newest First
- Locked First

---

## Dashboard Estatísticas

Mostra cards com contagens:
- **Total**: Todos os bonuses
- **Unlocked**: Bonuses desbloqueados
- **Locked**: Bonuses trancados
- **New**: Marcados como novos
- **Videos**: Categoria video
- **PDFs**: Categoria pdf
- **Other**: Ebook + Tool + Template + Session

Cores dos cards:
- 🔵 Total (blue)
- 🟢 Unlocked (green)
- 🟡 Locked (yellow)
- 🟣 New (purple)
- 🔴 Videos (red)
- 🟢 PDFs (emerald)
- 🟠 Other (orange)

---

## Tecnologias e Dependências

### Componentes UI (shadcn/ui)
- ✅ Dialog - Modals
- ✅ Table - Tabela de dados
- ✅ Card - Containers
- ✅ Button - Ações
- ✅ Input / Textarea - Forms
- ✅ Select - Dropdowns
- ✅ Checkbox - Seleção múltipla
- ✅ Badge - Status badges
- ✅ AlertDialog - Confirmações
- ✅ DropdownMenu - Menu de ações

### Ícones (lucide-react)
- Plus, Pencil, Trash2, Eye, Lock, Unlock
- Copy, Download, Upload, RefreshCw
- Search, Filter, ChevronUp, ChevronDown
- Gift, FileJson, MoreVertical
- Play, BookOpen, FileText, Wrench, Clock, Star, CheckCircle2

### Biblioteca de Notificações
- `sonner` - Toast notifications

### Utilitários
- `cn()` - Class name merger (lib/utils)

---

## Persistência de Dados

### LocalStorage
- **Key**: `"nep_bonuses_data"`
- **Formato**: JSON array de BonusData
- **Inicialização**: Se vazio, carrega `mockBonusesData`

### Preparado para Supabase
Todas as funções em `bonusesService.ts` estão estruturadas para fácil migração:

```typescript
// Atual (localStorage)
export function getAllBonuses(): BonusData[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Futuro (Supabase)
export async function getAllBonuses(): Promise<BonusData[]> {
  const { data, error } = await supabase
    .from('bonuses')
    .select('*');
  return data ?? [];
}
```

---

## Validações

### Form Validation
- ✅ Title: obrigatório, mínimo 1 caractere
- ✅ Description: obrigatório, mínimo 1 caractere
- ✅ Category: obrigatório, deve ser um dos valores válidos
- ✅ Thumbnail: opcional, deve ser URL válida se preenchido
- ✅ Progress: número entre 0-100
- ✅ Tags: separadas por vírgula, whitespace trimmed

### Import Validation
- ✅ JSON válido
- ✅ Array de objetos
- ✅ Cada objeto tem title, description, category

---

## Features Extras Implementadas

### 1. Drag & Drop (Preparado)
- Estrutura pronta em `bonusesService.ts`:
  ```typescript
  export function reorderBonuses(bonuses: BonusData[]): void
  ```
- Pode ser implementado com `@dnd-kit/core` ou `react-beautiful-dnd`

### 2. Bulk Actions
- ✅ Seleção múltipla
- ✅ Delete em massa
- Futuro: Bulk lock/unlock, bulk category change

### 3. Export/Import JSON
- ✅ Export completo
- ✅ Import com validação
- Formato compatível com backup/restore

### 4. Category Icons & Colors
Cada categoria tem ícone e cor únicos:
```typescript
video:    Play icon,     red gradient
ebook:    BookOpen icon, blue gradient
pdf:      FileText icon, emerald gradient
tool:     Wrench icon,   purple gradient
template: FileText icon, violet gradient
session:  Clock icon,    orange gradient
```

### 5. Live Preview
- Preview card em tempo real no form modal
- Mostra exatamente como aparecerá para usuários
- Toggle show/hide para economizar espaço

### 6. Smart Guidelines
- Formulário mostra dicas específicas por categoria
- Ex: "Video" → "Add duration, use viewUrl"
- Ex: "PDF" → "Add file size, downloadUrl"

---

## Testes de Funcionalidade

### ✅ Checklist Completo

#### CRUD Básico
- [x] Criar novo bonus
- [x] Editar bonus existente
- [x] Deletar bonus
- [x] Listar todos os bonuses

#### Filtros e Busca
- [x] Search por título
- [x] Search por descrição
- [x] Search por tags
- [x] Filter por categoria
- [x] Sort por título
- [x] Sort por categoria
- [x] Sort por newest
- [x] Sort por locked

#### Ações Especiais
- [x] Toggle lock/unlock
- [x] Duplicar bonus
- [x] Preview modal
- [x] Bulk delete
- [x] Export JSON
- [x] Import JSON
- [x] Reset to mock data

#### UI/UX
- [x] Form validation
- [x] Toast notifications
- [x] Confirmation dialogs
- [x] Live preview
- [x] Responsive design
- [x] Loading states
- [x] Empty states

#### Dados
- [x] LocalStorage persistence
- [x] Auto-generate IDs
- [x] Stats calculation
- [x] Category counts

---

## Próximos Passos (Opcional)

### Melhorias Futuras
1. **Supabase Integration**
   - Migrar de localStorage para Supabase
   - Real-time updates
   - Multi-user support

2. **Drag & Drop Reordering**
   - Implementar reordenação visual
   - Salvar ordem preferida

3. **Image Upload**
   - Upload direto de thumbnails
   - Integração com Supabase Storage

4. **Advanced Filters**
   - Filter por locked/unlocked
   - Filter por completed
   - Filter por tags

5. **Analytics**
   - Track visualizações
   - Track downloads
   - Popular bonuses

6. **User Progress Tracking**
   - Marcar bonuses como completados
   - Progress por usuário
   - Achievements/badges

---

## Troubleshooting

### Problema: Bonuses não aparecem
**Solução**: Verificar se localStorage tem dados:
```javascript
console.log(localStorage.getItem('nep_bonuses_data'));
```
Se vazio, click em "Reset" para carregar mock data.

### Problema: Form não salva
**Solução**: Verificar validação (title e description obrigatórios).

### Problema: Import falha
**Solução**: Validar JSON:
```json
[
  {
    "title": "Test",
    "description": "Test description",
    "category": "video",
    "locked": false
  }
]
```

### Problema: Estatísticas erradas
**Solução**: Refresh a página para recalcular contagens.

---

## Código de Exemplo

### Criar Bonus Programaticamente
```typescript
import { createBonus } from '@/lib/bonusesService';

const newBonus = createBonus({
  title: "NEP Masterclass",
  description: "Advanced parenting strategies",
  category: "video",
  thumbnail: "https://example.com/image.jpg",
  duration: "30 min",
  locked: false,
  isNew: true,
  tags: ["Advanced", "Video", "Masterclass"],
  viewUrl: "/videos"
});
```

### Filtrar Bonuses por Categoria
```typescript
import { searchBonuses } from '@/lib/bonusesService';

const videos = searchBonuses('', 'video');
const pdfs = searchBonuses('', 'pdf');
const neuroscienceBonuses = searchBonuses('neuroscience');
```

### Export e Download
```typescript
import { exportBonusesToJSON } from '@/lib/bonusesService';

const json = exportBonusesToJSON();
const blob = new Blob([json], { type: 'application/json' });
const url = URL.createObjectURL(blob);
// Trigger download...
```

---

## Conclusão

Sistema completo de gerenciamento de bonuses implementado com sucesso!

### Recursos Principais:
✅ CRUD completo
✅ Filtros e ordenação
✅ Bulk operations
✅ Export/Import
✅ Live preview
✅ Responsive design
✅ LocalStorage (pronto para Supabase)

### Arquivos Criados:
1. `src/lib/bonusesService.ts` - Service layer
2. `src/components/Admin/AdminBonusesTab.tsx` - Main tab
3. `src/components/Admin/BonusesTable.tsx` - Data table
4. `src/components/Admin/BonusFormModal.tsx` - Create/Edit form

### Arquivo Modificado:
1. `src/pages/Admin.tsx` - Added Bonuses tab

**Build Status**: ✅ Compilação bem-sucedida
**Dependencies**: ✅ Todas instaladas
**Ready for Production**: ✅ Sim

---

**Developed with**: React + TypeScript + Vite + shadcn/ui
**Version**: 1.0.0
**Date**: 2025-01-12
