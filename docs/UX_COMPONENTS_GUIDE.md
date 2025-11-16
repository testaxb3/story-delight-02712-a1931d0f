# UX Components Guide - NEP System

## Sprint 4 - UX Improvements Implementation

Esta documentação cobre os componentes de UX melhorados implementados no Sprint 4.

---

## 📦 Componentes Disponíveis

### 1. LoadingState
**Localização:** `src/components/common/LoadingState.tsx`

Componente reutilizável para estados de carregamento com mensagens personalizadas.

**Props:**
- `message?: string` - Mensagem exibida (default: "Loading...")
- `size?: 'sm' | 'md' | 'lg'` - Tamanho do spinner (default: 'md')
- `className?: string` - Classes CSS adicionais

**Uso:**
```tsx
import { LoadingState } from '@/components/common';

// Básico
<LoadingState />

// Com mensagem customizada
<LoadingState message="Loading scripts..." size="lg" />

// Em páginas
{isLoading && <LoadingState message="Fetching data..." />}
```

---

### 2. ConfirmDialog
**Localização:** `src/components/common/ConfirmDialog.tsx`

Diálogo de confirmação para ações destrutivas ou importantes.

**Props:**
- `open: boolean` - Estado do diálogo
- `onOpenChange: (open: boolean) => void` - Callback de mudança de estado
- `onConfirm: () => void` - Callback de confirmação
- `title: string` - Título do diálogo
- `description: string` - Descrição/mensagem
- `confirmText?: string` - Texto do botão de confirmar (default: "Confirm")
- `cancelText?: string` - Texto do botão de cancelar (default: "Cancel")
- `variant?: 'default' | 'destructive'` - Estilo do botão (default: 'default')

**Uso:**
```tsx
import { ConfirmDialog } from '@/components/common';

const [isOpen, setIsOpen] = useState(false);

<ConfirmDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  onConfirm={() => {
    deleteItem();
    setIsOpen(false);
  }}
  title="Delete Item"
  description="Are you sure you want to delete this item? This action cannot be undone."
  confirmText="Delete"
  cancelText="Cancel"
  variant="destructive"
/>
```

---

### 3. useConfirm Hook
**Localização:** `src/hooks/useConfirm.tsx`

Hook para gerenciar confirmações de forma programática com promises.

**Retorno:**
- `confirm: (options) => Promise<boolean>` - Função que mostra o diálogo e retorna uma promise
- `ConfirmDialogComponent: JSX.Element` - Componente a ser renderizado

**Uso:**
```tsx
import { useConfirm } from '@/hooks/useConfirm';

function MyComponent() {
  const { confirm, ConfirmDialogComponent } = useConfirm();

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Delete Script',
      description: 'Are you sure you want to delete this script?',
      confirmText: 'Delete',
      variant: 'destructive'
    });

    if (confirmed) {
      // Executar ação
      await deleteScript();
    }
  };

  return (
    <>
      <Button onClick={handleDelete}>Delete</Button>
      {ConfirmDialogComponent}
    </>
  );
}
```

---

### 4. FeedbackToast
**Localização:** `src/components/common/FeedbackToast.tsx`

Sistema de toasts com feedback visual consistente usando Sonner.

**API:**
```tsx
import { showToast } from '@/components/common/FeedbackToast';

// Success
showToast.success({
  title: 'Script saved!',
  description: 'Your script has been saved successfully.',
  duration: 4000,
  action: {
    label: 'View',
    onClick: () => navigate('/scripts')
  }
});

// Error
showToast.error({
  title: 'Failed to save',
  description: 'Please try again later.',
});

// Warning
showToast.warning({
  title: 'Unsaved changes',
  description: 'You have unsaved changes that will be lost.',
});

// Info
showToast.info({
  title: 'New feature available',
  description: 'Check out the new scripts!',
});

// Loading (retorna ID do toast)
const toastId = showToast.loading({
  title: 'Saving...',
  description: 'Please wait while we save your changes.',
});

// Promise (automático success/error)
showToast.promise(
  saveScript(),
  {
    loading: 'Saving script...',
    success: 'Script saved successfully!',
    error: 'Failed to save script',
  }
);
```

---

### 5. OptimizedImage
**Localização:** `src/components/common/OptimizedImage.tsx`

Componente de imagem otimizado com lazy loading e placeholders.

**Props:**
- `src: string` - URL da imagem
- `alt: string` - Texto alternativo (acessibilidade)
- `className?: string` - Classes CSS para a imagem
- `placeholderClassName?: string` - Classes CSS para o placeholder
- `eager?: boolean` - Carrega imediatamente (default: false)
- Aceita todas as props de `<img>`

**Uso:**
```tsx
import { OptimizedImage } from '@/components/common';

// Lazy loading automático
<OptimizedImage
  src="/path/to/image.jpg"
  alt="Description"
  className="w-full h-48 object-cover rounded-lg"
/>

// Above-the-fold (eager)
<OptimizedImage
  src="/hero-image.jpg"
  alt="Hero"
  eager
  className="w-full h-96 object-cover"
/>

// Com placeholder customizado
<OptimizedImage
  src={userAvatar}
  alt="User avatar"
  className="w-12 h-12 rounded-full"
  placeholderClassName="bg-gradient-to-br from-purple-400 to-pink-400"
/>
```

---

### 6. EmptyState (Scripts)
**Localização:** `src/components/scripts/EmptyState.tsx`

Estado vazio específico para Scripts com animações.

**Props:**
- `type: 'no-results' | 'no-scripts' | 'no-favorites' | 'error'`
- `searchQuery?: string` - Query de busca (para tipo 'no-results')
- `onClearSearch?: () => void` - Callback para limpar busca
- `onRetry?: () => void` - Callback para tentar novamente (tipo 'error')

**Uso:**
```tsx
import { EmptyState } from '@/components/scripts/EmptyState';

// Sem resultados de busca
{filteredScripts.length === 0 && searchQuery && (
  <EmptyState
    type="no-results"
    searchQuery={searchQuery}
    onClearSearch={() => setSearchQuery('')}
  />
)}

// Nenhum script
{scripts.length === 0 && (
  <EmptyState type="no-scripts" />
)}

// Erro
{error && (
  <EmptyState
    type="error"
    onRetry={() => refetch()}
  />
)}
```

---

## 🎨 Design System

Todos os componentes seguem o design system do NEP System:

- **Cores:** Usam tokens semânticos (`--primary`, `--muted`, etc.)
- **Animações:** Suaves e consistentes (duration-300, ease-in-out)
- **Espaçamento:** Sistema de 4px
- **Acessibilidade:** ARIA labels, focus states visíveis
- **Dark Mode:** Suporte completo

---

## 📊 Métricas de Sucesso

**Objetivos:**
- ✅ Reduzir tempo de feedback visual em 50%
- ✅ Aumentar clareza de estados (loading, empty, error)
- ✅ Melhorar confirmações de ações destrutivas
- ✅ Consistência visual em 100% das páginas

**Como medir:**
- User feedback sobre clareza de ações
- Redução de erros por ações não intencionais
- Tempo médio para completar ações

---

## 🔧 Próximos Passos

1. Aplicar LoadingState em todas as páginas
2. Adicionar ConfirmDialog em ações admin
3. Migrar todos os toasts para FeedbackToast
4. Criar variantes adicionais de EmptyState
5. Documentar padrões de erro handling

---

## 📚 Referências

- [Shadcn UI Documentation](https://ui.shadcn.com/)
- [Sonner Toast Library](https://sonner.emilkowal.ski/)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)
