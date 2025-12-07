/**
 * Centralized Navigation Routes
 * 
 * Single source of truth for all navigation paths in the application.
 * Makes maintenance easier and prevents broken links.
 * 
 * @example
 * import { routes } from '@/lib/navigation';
 * navigate(routes.bonusesVideos);
 */
export const routes = {
  // Main Navigation
  home: '/',
  auth: '/auth',
  welcome: '/welcome', // Post-purchase onboarding
  onboarding: '/onboarding',
  
  // PWA Installation Flow
  pwaInstall: '/pwa-install',
  pwaCheck: '/pwa-check',
  themeSelection: '/theme-selection',
  notificationPermission: '/notification-permission',
  
  // Primary Pages
  scripts: '/scripts',
  bonuses: '/bonuses',
  bonusesVideos: '/bonuses?category=video', // Videos migrated to bonuses
  listen: '/listen',
  listenUpgrade: '/listen/upgrade',
  community: '/community',
  profile: '/profile',
  tracker: '/tracker',
  
  // Community Sub-pages
  communityCreate: '/community/create',
  communityAddLogo: '/community/add-logo',
  communityFeed: '/community/feed',
  communityMembers: '/community/members',
  communityJoin: '/community/join',
  
  // Profile Sub-pages
  profileEdit: '/profile/edit',
  
  // Content Pages
  library: '/library',
  ebookReader: (ebookId: string) => `/ebook/${ebookId}`,
  
  // Admin & Tools
  admin: '/admin',
  methodology: '/methodology',
  scriptRequests: '/script-requests',
  generateWelcomePDF: '/generate-welcome-pdf',
  
  // Legal Pages
  terms: '/terms',
  privacy: '/privacy',
  refundPolicy: '/refund-policy',
  
  // Refund
  refund: '/refund',
  refundStatus: '/refund-status',
  
  // Quiz
  quiz: '/quiz',
} as const;

/**
 * Type-safe route keys
 */
export type RouteKey = keyof typeof routes;

/**
 * Helper to check if a path is a valid route
 */
export const isValidRoute = (path: string): boolean => {
  return Object.values(routes).some(route => 
    typeof route === 'string' ? route === path : false
  );
};
