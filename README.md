# Brainy Child Guide

A modern parenting application built with React, TypeScript, and Supabase, designed to provide science-based guidance and community support for parents.

## Overview

Brainy Child Guide is a comprehensive parenting platform that combines:
- Science-backed methodology and research
- Interactive community features with forums and discussions
- Premium bonuses system with ebooks, videos, and downloadable resources
- Admin dashboard for content management
- Responsive design optimized for all devices

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: Radix UI + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State Management**: Zustand + TanStack Query
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Animation**: Framer Motion

## Project Structure

```
brainy-child-guide/
├── src/                          # Source code
│   ├── components/               # React components
│   │   ├── Admin/               # Admin panel components
│   │   ├── bonuses/             # Bonus system components
│   │   ├── Community/           # Community features
│   │   ├── ebook/               # Ebook reader components
│   │   └── Navigation/          # Navigation components
│   ├── pages/                   # Page components
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility functions and services
│   ├── data/                    # Static data and content
│   └── integrations/            # External integrations (Supabase)
├── public/                      # Static assets
├── supabase/                    # Supabase configuration
│   └── migrations/              # Database migrations
│       └── archived/            # Archived/old migrations
├── docs/                        # Documentation
│   ├── implementation/          # Technical implementation docs
│   ├── guides/                  # User guides and tutorials
│   ├── helpers/                 # Development helper tools (HTML)
│   └── archive/                 # Archived documentation
├── scripts/                     # Utility scripts
│   ├── migrations/              # Migration scripts (.mjs)
│   ├── seeds/                   # Database seed scripts
│   └── utilities/               # Utility scripts
├── ebooks/                      # Ebook files
└── PROJETO CLAUDE/              # Project documentation

```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd brainy-child-guide
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run database migrations:
```bash
# Apply Supabase migrations
# See docs/guides/ for migration guides
```

5. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run diagnose` - Run Supabase diagnostics

## Key Features

### 1. Community Premium (Phase 1)
- Forums and discussion boards
- User profiles with avatars
- Comments and nested replies
- Reactions and badges system
- Notifications

### 2. Bonuses System
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
