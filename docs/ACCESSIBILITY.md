# ♿ Accessibility Guide

Comprehensive accessibility (a11y) guide for NEP System.

---

## 📋 Table of Contents

1. [Accessibility Standards](#accessibility-standards)
2. [Current Status](#current-status)
3. [Implementation Guidelines](#implementation-guidelines)
4. [Component Examples](#component-examples)
5. [Testing](#testing)
6. [Known Issues](#known-issues)

---

## 📏 Accessibility Standards

### WCAG 2.1 Compliance
We aim for **WCAG 2.1 Level AA** compliance:

- **Level A:** Minimum accessibility features
- **Level AA:** Standard compliance (our target)
- **Level AAA:** Enhanced accessibility

### Key Principles (POUR)

1. **Perceivable** - Users can perceive the information
2. **Operable** - Users can operate the interface
3. **Understandable** - Users can understand the information
4. **Robust** - Content works with various technologies

---

## ✅ Current Status

### Implemented Features

#### ✅ Keyboard Navigation
- Tab order follows logical flow
- Focus visible on all interactive elements
- Escape key closes modals/dropdowns
- Enter/Space activates buttons

#### ✅ Screen Reader Support
- Semantic HTML (`<header>`, `<main>`, `<nav>`)
- ARIA labels on icon buttons
- Alt text on images
- Form labels properly associated

#### ✅ Color & Contrast
- 4.5:1 contrast ratio for normal text
- 3:1 contrast ratio for large text
- Color not sole indicator of meaning
- Focus indicators visible

#### ✅ Responsive Design
- Works on all screen sizes
- Touch targets ≥44x44px
- Text resizable up to 200%
- No horizontal scrolling

### Areas for Improvement

#### 🚧 To Implement
- [ ] Skip navigation link
- [ ] Landmark regions (ARIA)
- [ ] Live regions for dynamic content
- [ ] Better error announcements
- [ ] Enhanced keyboard shortcuts
- [ ] High contrast mode

---

## 🎯 Implementation Guidelines

### Semantic HTML

```tsx
// ✅ Good - Semantic elements
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Title</h1>
    <p>Content</p>
  </article>
</main>

<footer>
  <p>&copy; 2024 NEP System</p>
</footer>

// ❌ Bad - Generic divs
<div className="header">
  <div className="nav">...</div>
</div>
<div className="main">...</div>
<div className="footer">...</div>
```

### ARIA Labels

```tsx
// Icon buttons MUST have labels
<Button
  aria-label="Close modal"
  onClick={onClose}
>
  <X className="h-4 w-4" />
</Button>

// Decorative icons should be hidden
<Mail className="h-4 w-4" aria-hidden="true" />
<span>Email</span>

// Complex components need descriptions
<Dialog
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <DialogTitle id="dialog-title">Confirm Delete</DialogTitle>
  <DialogDescription id="dialog-description">
    This action cannot be undone
  </DialogDescription>
</Dialog>
```

### Keyboard Navigation

```tsx
// Make custom interactive elements keyboard accessible
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  Custom Button
</div>

// Focus management for modals
useEffect(() => {
  if (isOpen) {
    const firstInput = modalRef.current?.querySelector('input');
    firstInput?.focus();
  }
}, [isOpen]);

// Trap focus within modal
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    onClose();
  }
  
  if (e.key === 'Tab') {
    // Trap focus logic
  }
};
```

### Form Accessibility

```tsx
// ✅ Good - Proper labels
<div>
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    aria-required="true"
    aria-invalid={!!errors.email}
    aria-describedby={errors.email ? "email-error" : undefined}
  />
  {errors.email && (
    <span id="email-error" role="alert">
      {errors.email.message}
    </span>
  )}
</div>

// ❌ Bad - No labels
<Input type="email" placeholder="Enter email" />
```

### Focus Management

```tsx
// Visible focus indicators
.focus-visible:focus {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

// Skip to main content
<a
  href="#main-content"
  className="sr-only focus:not-sr-only"
>
  Skip to main content
</a>

<main id="main-content">...</main>

// Manage focus after actions
const handleDelete = async () => {
  await deleteItem();
  // Return focus to trigger button
  triggerRef.current?.focus();
};
```

### Screen Reader Only Content

```tsx
// Utility class for screen reader only text
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

// Usage
<button>
  <TrashIcon aria-hidden="true" />
  <span className="sr-only">Delete item</span>
</button>
```

---

## 🎨 Component Examples

### Accessible Button

```tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel?: string;
  disabled?: boolean;
}

export function Button({ 
  children, 
  onClick, 
  ariaLabel,
  disabled = false 
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      className="focus-visible:ring-2"
    >
      {children}
    </button>
  );
}
```

### Accessible Modal

```tsx
export function Modal({ isOpen, onClose, title, children }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus first focusable element
      const firstInput = overlayRef.current?.querySelector(
        'button, input, textarea, select'
      );
      (firstInput as HTMLElement)?.focus();

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      }}
    >
      <div className="overlay" onClick={onClose} />
      <div className="modal-content">
        <h2 id="modal-title">{title}</h2>
        {children}
        <button
          onClick={onClose}
          aria-label="Close modal"
        >
          <X />
        </button>
      </div>
    </div>
  );
}
```

### Accessible Dropdown

```tsx
export function Dropdown({ items, onSelect }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % items.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + items.length) % items.length);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelect(items[activeIndex]);
        setIsOpen(false);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div>
      <button
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        Select option
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label="Options"
          onKeyDown={handleKeyDown}
        >
          {items.map((item, index) => (
            <li
              key={item.id}
              role="option"
              aria-selected={index === activeIndex}
              onClick={() => {
                onSelect(item);
                setIsOpen(false);
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

## 🧪 Testing

### Automated Testing

```bash
# Install axe-core
npm install -D @axe-core/react

# In tests
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

test('should have no accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual Testing Checklist

#### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Shift+Tab works in reverse
- [ ] Enter/Space activates buttons/links
- [ ] Arrow keys navigate menus/lists
- [ ] Escape closes modals/dropdowns
- [ ] Focus visible on all elements

#### Screen Reader Testing
- [ ] Install NVDA (Windows) or VoiceOver (Mac)
- [ ] Navigate entire page
- [ ] All interactive elements announced
- [ ] Form errors read correctly
- [ ] Images have alt text
- [ ] Buttons have descriptive labels

#### Visual Testing
- [ ] Zoom to 200% (no horizontal scroll)
- [ ] High contrast mode (Windows)
- [ ] Dark mode works correctly
- [ ] Color blindness simulation
- [ ] Touch targets ≥44x44px

### Browser Testing
- Chrome + ChromeVox
- Firefox + NVDA
- Safari + VoiceOver
- Edge + Narrator

### Tools
- **Lighthouse** - Automated audit
- **axe DevTools** - Browser extension
- **WAVE** - Web accessibility evaluation
- **Color Contrast Analyzer** - Check ratios

---

## 🐛 Known Issues

### High Priority
- [ ] Some admin tables lack proper ARIA labels
- [ ] Dynamic content updates not announced
- [ ] Keyboard shortcuts documentation missing

### Medium Priority
- [ ] Focus management in complex modals
- [ ] Better error announcements
- [ ] Skip navigation links

### Low Priority
- [ ] Enhanced keyboard shortcuts
- [ ] High contrast theme
- [ ] Reduced motion preferences

---

## 📚 Resources

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project](https://www.a11yproject.com/)
- [Radix UI A11y](https://www.radix-ui.com/docs/primitives/overview/accessibility)

### Testing Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Screen Readers
- [NVDA](https://www.nvaccess.org/) (Windows, Free)
- [JAWS](https://www.freedomscientific.com/products/software/jaws/) (Windows)
- [VoiceOver](https://www.apple.com/accessibility/voiceover/) (Mac/iOS)
- [TalkBack](https://support.google.com/accessibility/android/answer/6283677) (Android)

---

**Last Updated:** 2024-11-16
