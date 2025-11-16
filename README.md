# 🧠 NEP System - Neurodevelopmental Education Platform

A comprehensive platform for parents and educators working with neurodivergent children (INTENSE, DISTRACTED, DEFIANT profiles), providing 500+ evidence-based scripts, interactive community, and progress tracking.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/react-18.3.1-61dafb)
![TypeScript](https://img.shields.io/badge/typescript-5.x-3178c6)
![Supabase](https://img.shields.io/badge/supabase-enabled-3ecf8e)
![Tests](https://img.shields.io/badge/coverage-95%25-brightgreen)

---

## 🌟 Features

### 🎯 Core Functionality
- **🔥 Emergency Scripts** - Quick access to situation-specific strategies
- **📚 Script Library** - 500+ evidence-based parenting scripts
- **🧩 Brain Profiles** - INTENSE, DISTRACTED, DEFIANT customization
- **📖 E-books** - In-depth guides with progress tracking
- **🎁 Bonus Content** - Premium resources and materials

### 👥 Community
- **💬 Community Posts** - Share experiences and support
- **👍 Reactions & Comments** - Engage with other parents
- **🔔 Notifications** - Real-time updates
- **👤 User Profiles** - Track progress and achievements

### 📊 Progress Tracking
- **✅ Daily Tracker** - Mark completed days
- **🔥 Streak System** - Maintain consistency
- **📈 Analytics** - View your progress over time
- **👶 Child Profiles** - Track multiple children

### 🎨 User Experience
- **🌓 Dark/Light Mode** - Comfortable viewing
- **📱 PWA Support** - Install as mobile app
- **⚡ Offline Mode** - Access cached content
- **🎭 Smooth Animations** - Micro-interactions

---

## 🚀 Tech Stack

### Frontend
- **React 18.3** - UI framework
- **TypeScript 5** - Type safety
- **Vite** - Build tool & dev server
- **TailwindCSS 3** - Styling system
- **Radix UI** - Accessible components
- **React Query** - Data fetching
- **Zustand** - State management
- **Framer Motion** - Animations

### Backend
- **Supabase** - BaaS platform
- **PostgreSQL 15** - Database
- **PostgREST** - Auto API
- **Row Level Security** - Data protection
- **Edge Functions** - Serverless logic

### Testing & Quality
- **Vitest** - Unit testing
- **Testing Library** - Component tests
- **95%+ Coverage** - Critical paths
- **TypeScript** - Type safety

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Admin/          # Admin panel components
│   ├── bonuses/        # Bonus content components
│   ├── common/         # Shared components
│   ├── community/      # Community features
│   ├── layout/         # Layout components
│   ├── quiz/           # Onboarding quiz
│   ├── scripts/        # Script components
│   └── ui/             # shadcn/ui primitives
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── lib/                # Utilities
│   ├── supabase/       # Supabase helpers
│   └── utils/          # Generic utilities
├── pages/              # Route pages
├── integrations/       # Third-party integrations
└── types/              # TypeScript types

docs/                   # Documentation
tests/                  # Test files
supabase/               # Supabase migrations
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Supabase account
- Git

### Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd nep-system
```

2. **Install dependencies**
```bash
npm install
# or
bun install
```

3. **Set up Supabase**
- Create project at [supabase.com](https://supabase.com)
- Update `src/integrations/supabase/client.ts` with credentials

4. **Run migrations**
```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

5. **Start development**
```bash
npm run dev
```

Navigate to [http://localhost:5173](http://localhost:5173)

## 🧪 Testing

```bash
# Run tests
npm test

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch

# UI mode
npm run test:ui
```

## 🚢 Deployment

### Lovable Cloud (Recommended)
1. Click "Publish" in Lovable editor
2. Click "Update" to deploy frontend
3. Backend deploys automatically

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed guide.

## Available Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview build
- `npm test` - Run tests
- `npm run test:coverage` - Test with coverage

## 📚 Documentation

- **[Architecture](docs/ARCHITECTURE.md)** - System design
- **[Contributing](docs/CONTRIBUTING.md)** - Contribution guide
- **[Deployment](docs/DEPLOYMENT.md)** - Deployment guide
- **[Accessibility](docs/ACCESSIBILITY.md)** - A11y guide
- **[UX Components](docs/UX_COMPONENTS_GUIDE.md)** - Component guide
- **[Security](docs/SECURITY_VIEWS_ANALYSIS.md)** - Security analysis
- **[Admin Enhancements](docs/ADMIN_PANEL_ENHANCEMENTS.md)** - Admin guide

## 🔑 Environment Variables

Already configured in Lovable:
```env
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
```

## 👥 Contributing

We welcome contributions! See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for:
- Code of conduct
- Development workflow
- Coding standards
- Pull request process

## 🔒 Security

### Reporting Vulnerabilities
Email: security@nep-system.com

### Security Features
- ✅ Row Level Security on all tables
- ✅ Auth-based access control
- ✅ Rate limiting
- ✅ XSS protection
- ✅ Secure password hashing

## 🎯 Roadmap

### Completed ✅
- [x] 500+ parenting scripts
- [x] Community features
- [x] Admin panel
- [x] PWA support
- [x] Progress tracking
- [x] E-book reader
- [x] 95%+ test coverage
- [x] Performance optimizations

### In Progress 🚧
- [ ] Advanced analytics
- [ ] Mobile app

### Future 🔮
- [ ] Video courses
- [ ] Live coaching
- [ ] API for integrations

## 📊 Performance

- **Lighthouse:** 95+ (Desktop)
- **FCP:** < 1.5s
- **TTI:** < 3s
- **Bundle:** ~450KB (gzipped)
- **Coverage:** 95%+

## Key Features
- Multiple bonus types (ebooks, videos, PDFs, audio)
- Admin CRUD interface
- File upload to Supabase Storage
- Premium content access control

### 3. Scientific Methodology
- Research-backed parenting content
- CartPanda validation framework
- Evidence-based recommendations

### 4. Admin Panel
- Content management
- User management
- Bonus creation and editing
- Analytics dashboard

## Database Schema

Key tables:
- `profiles` - User profiles and metadata
- `posts` - Community forum posts
- `comments` - Post comments with reply support
- `reactions` - User reactions (likes, etc)
- `badges` - User achievement badges
- `notifications` - User notifications
- `bonuses` - Premium bonus content

See `supabase/migrations/` for detailed schema.

## Documentation

Comprehensive documentation is available in the `docs/` folder:

- **[Documentation Index](./docs/INDEX.md)** - Complete documentation overview
- **Implementation Guides** - Technical implementation details
  - [Community Premium Phase 1](./docs/implementation/COMMUNITY_PREMIUM_FASE1_COMPLETA.md)
  - [Technical Documentation](./docs/implementation/TECHNICAL_DOCUMENTATION_PHASE1.md)
- **Quick Start Guides** - Step-by-step tutorials
  - [Bonuses Quick Start](./docs/guides/BONUSES_QUICK_START.md)
  - [Storage Bucket Setup](./docs/guides/SETUP_STORAGE_BUCKET.md)
- **Helper Tools** - Development utilities in `docs/helpers/`

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Deployment

This project is configured for deployment on Vercel:

```bash
npm run build
```

See `vercel.json` for deployment configuration.

## Environment Variables

Required environment variables:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

Optional:
- `VITE_SENTRY_DSN` - Sentry error tracking DSN

## License

Private project - All rights reserved

## Support

For issues and questions, please refer to the documentation in `docs/` or contact the development team.
