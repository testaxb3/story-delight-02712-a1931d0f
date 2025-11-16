# 🤝 Contributing to NEP System

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the NEP System project.

---

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Testing Guidelines](#testing-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Project Structure](#project-structure)
8. [Common Tasks](#common-tasks)

---

## 📜 Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inclusive experience for everyone.

### Expected Behavior
- Be respectful and considerate
- Use inclusive language
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior
- Harassment or discrimination
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information
- Other unprofessional conduct

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Git
- Supabase account (for backend work)
- Code editor (VS Code recommended)

### First Time Setup

1. **Fork the repository**
```bash
# Click "Fork" on GitHub
```

2. **Clone your fork**
```bash
git clone https://github.com/YOUR_USERNAME/nep-system.git
cd nep-system
```

3. **Add upstream remote**
```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/nep-system.git
```

4. **Install dependencies**
```bash
npm install
```

5. **Set up Supabase**
```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

6. **Start development**
```bash
npm run dev
```

---

## 🔄 Development Workflow

### 1. Create a Branch
```bash
# Update main
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### Branch Naming Convention
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code refactoring
- `test/` - Test additions/changes
- `chore/` - Maintenance tasks

### 2. Make Changes
- Write clean, readable code
- Follow coding standards (see below)
- Write tests for new features
- Update documentation as needed

### 3. Commit Changes
```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add user profile settings"
```

### Commit Message Convention
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Maintenance

**Examples:**
```bash
feat(scripts): add emergency script filter
fix(auth): resolve login timeout issue
docs(readme): update installation instructions
refactor(hooks): extract useScript logic
test(community): add post creation tests
```

### 4. Push Changes
```bash
git push origin feature/your-feature-name
```

### 5. Create Pull Request
1. Go to GitHub
2. Click "New Pull Request"
3. Fill out PR template
4. Request review

---

## 💻 Coding Standards

### TypeScript
```typescript
// ✅ Good - Explicit types
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

function getUserProfile(userId: string): Promise<UserProfile> {
  // ...
}

// ❌ Bad - Implicit any
function getUserProfile(userId) {
  // ...
}
```

### React Components
```tsx
// ✅ Good - Typed props, clear structure
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function Button({ onClick, children, variant = 'primary' }: ButtonProps) {
  return (
    <button className={cn('btn', `btn-${variant}`)} onClick={onClick}>
      {children}
    </button>
  );
}

// ❌ Bad - No types, unclear
export function Button(props) {
  return <button onClick={props.onClick}>{props.children}</button>;
}
```

### Hooks
```typescript
// ✅ Good - Clear naming, types
export function useScripts(filters?: ScriptFilters) {
  return useQuery({
    queryKey: ['scripts', filters],
    queryFn: () => fetchScripts(filters)
  });
}

// ❌ Bad - Generic naming
export function useData() {
  return useQuery({
    queryKey: ['data'],
    queryFn: fetchData
  });
}
```

### Design System Usage
```tsx
// ✅ Good - Semantic tokens
<div className="bg-background text-foreground">
  <h1 className="text-primary">Title</h1>
</div>

// ❌ Bad - Direct colors
<div className="bg-white text-black">
  <h1 className="text-blue-500">Title</h1>
</div>
```

### File Organization
```typescript
// Component file structure
// 1. Imports (external, then internal)
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Types/Interfaces
interface Props {
  // ...
}

// 3. Component
export function Component({ }: Props) {
  // 4. Hooks
  const [state, setState] = useState();
  
  // 5. Handlers
  const handleClick = () => {};
  
  // 6. Effects
  useEffect(() => {}, []);
  
  // 7. Render
  return <div>...</div>;
}
```

---

## 🧪 Testing Guidelines

### Test Coverage
- Aim for 80%+ coverage on new code
- 100% coverage on critical paths (auth, payments)

### Test Structure
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    const mockFn = vi.fn();
    render(<Component onClick={mockFn} />);
    
    await userEvent.click(screen.getByRole('button'));
    
    expect(mockFn).toHaveBeenCalledOnce();
  });
});
```

### Running Tests
```bash
# Run all tests
npm test

# Run specific test
npm test -- scripts

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

---

## 📝 Pull Request Process

### Before Creating PR
1. ✅ All tests pass
2. ✅ Code follows style guide
3. ✅ Documentation updated
4. ✅ No console errors/warnings
5. ✅ Branch is up to date with main

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test these changes

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Code follows style guide
- [ ] No breaking changes
```

### Review Process
1. Automated tests must pass
2. At least 1 approval required
3. No merge conflicts
4. Address all review comments
5. Squash commits before merge

---

## 📂 Project Structure

### Key Directories
```
src/
├── components/       # React components
├── hooks/           # Custom React hooks
├── pages/           # Route components
├── contexts/        # React contexts
├── lib/             # Utilities
└── types/           # TypeScript types

docs/                # Documentation
tests/               # Test files
supabase/           # Database migrations
```

### Component Guidelines
- One component per file
- Keep components small (<200 lines)
- Extract complex logic to hooks
- Use compound components pattern

### Hook Guidelines
- Prefix with `use`
- One responsibility per hook
- Return object, not array (except useState-like)
- Document parameters and return types

---

## 🔧 Common Tasks

### Adding a New Component
1. Create component file
```tsx
// src/components/feature/Component.tsx
export function Component() {
  return <div>Component</div>;
}
```

2. Add tests
```tsx
// tests/components/feature/Component.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Component } from '@/components/feature/Component';

describe('Component', () => {
  it('should render', () => {
    render(<Component />);
    expect(screen.getByText('Component')).toBeInTheDocument();
  });
});
```

3. Export from index (if needed)
```tsx
// src/components/feature/index.ts
export { Component } from './Component';
```

### Adding a New Hook
1. Create hook file
```typescript
// src/hooks/useFeature.ts
export function useFeature() {
  // Implementation
  return { data, loading, error };
}
```

2. Add tests
```typescript
// tests/hooks/useFeature.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFeature } from '@/hooks/useFeature';

describe('useFeature', () => {
  it('should work', () => {
    const { result } = renderHook(() => useFeature());
    expect(result.current.data).toBeDefined();
  });
});
```

### Adding a Database Migration
1. Create migration file
```sql
-- supabase/migrations/YYYYMMDDHHMMSS_description.sql
CREATE TABLE IF NOT EXISTS table_name (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Users can view own data"
  ON table_name FOR SELECT
  USING (auth.uid() = user_id);
```

2. Test migration
```bash
npx supabase db reset
npx supabase db push
```

---

## ❓ Questions?

- Check [existing issues](https://github.com/owner/nep-system/issues)
- Ask in [Discord](#)
- Email: dev@nep-system.com

---

## 🎉 Thank You!

Your contributions make NEP System better for everyone. We appreciate your time and effort!

---

**Happy Coding! 🚀**
