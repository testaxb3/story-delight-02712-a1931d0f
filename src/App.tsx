import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UpdatePrompt } from "@/components/UpdatePrompt";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ChildProfilesProvider } from "./contexts/ChildProfilesContext";
import { AudioPlayerProvider } from "./contexts/AudioPlayerContext";
import { AudioPlayer } from "./components/audio/AudioPlayer";
import { NavigationProgress } from "./components/common/NavigationProgress";
import { initOneSignal } from "./lib/onesignal";
import { initAnalytics } from "./lib/analytics";
import { usePageTracking } from "./hooks/usePageTracking";
import { useErrorTracking } from "./hooks/useErrorTracking";

// PERFORMANCE OPTIMIZATION: Eager load critical pages (including onboarding flow)
// Onboarding pages MUST be eager-loaded to prevent MIME type errors from stale chunks
// ListenSeries and Scripts are eager-loaded to prevent chunk failures on iOS PWA
import Auth from "./pages/Auth";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/DashboardCalAI";
import NotFound from "./pages/NotFound";
import PWAInstall from "./pages/PWAInstall";
import PWACheck from "./pages/PWACheck";
import ThemeSelection from "./pages/ThemeSelection";
import NotificationPermission from "./pages/NotificationPermission";
import ListenSeries from "./pages/ListenSeries";
import Scripts from "./pages/Scripts";

// PERFORMANCE OPTIMIZATION: Lazy load non-critical pages for code splitting
// This reduces initial bundle size and improves Time to Interactive (TTI)
const RefundRequest = lazy(() => import("./pages/RefundRequest"));
const RefundStatus = lazy(() => import("./pages/RefundStatus"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const Quiz = lazy(() => import("./pages/Quiz"));
const Community = lazy(() => import("./pages/CommunityCalAI"));
const CreateGroupName = lazy(() => import("./pages/Community/CreateGroupName"));
const AddGroupLogo = lazy(() => import("./pages/Community/AddGroupLogo"));
const CommunityFeed = lazy(() => import("./pages/Community/CommunityFeed"));
const CreatePost = lazy(() => import("./pages/Community/CreatePost"));
const MembersList = lazy(() => import("./pages/Community/MembersList"));
const JoinCommunity = lazy(() => import("./pages/Community/JoinCommunity"));
const Tracker = lazy(() => import("./pages/TrackerCalAI"));
const Profile = lazy(() => import("./pages/ProfileCalAI"));
const ProfileEdit = lazy(() => import("./pages/Profile/Edit"));

const Bonuses = lazy(() => import("./pages/BonusesPremium"));
const CollectionDetail = lazy(() => import("./pages/CollectionDetail"));
const Listen = lazy(() => import("./pages/Listen"));
// ListenSeries moved to eager loading above to prevent iOS PWA chunk failures
const ListenUpgrade = lazy(() => import("./pages/ListenUpgrade"));
const EbookReader = lazy(() => import("./pages/EbookReaderV2"));
const Admin = lazy(() => import("./pages/Admin"));
const Methodology = lazy(() => import("./pages/Methodology"));
const ScriptRequests = lazy(() => import("./pages/ScriptRequests"));
const ScriptRequestStatus = lazy(() => import("./pages/ScriptRequestStatus"));
const GenerateWelcomePDF = lazy(() => import("./pages/GenerateWelcomePDF"));
const Achievements = lazy(() => import("./pages/Achievements"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const JoinFamily = lazy(() => import("./pages/JoinFamily"));
const Lessons = lazy(() => import("./pages/Lessons"));


// Loading fallback component for Suspense
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// PERFORMANCE: Optimized React Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes - increased for better caching
      gcTime: 60 * 60 * 1000, // 60 minutes - keep data longer
      refetchOnWindowFocus: false, // Only refetch when explicitly needed
      refetchOnReconnect: true, // Refetch on network reconnect
      retry: 1, // Only retry once on failure
      networkMode: 'offlineFirst', // Better offline support
    },
    mutations: {
      retry: 1, // Retry failed mutations once
      networkMode: 'offlineFirst', // Better offline support
    },
  },
});

function AppContent() {
  usePageTracking();
  useErrorTracking();
  
  useEffect(() => {
    // Initialize analytics immediately on app load
    initAnalytics();
    
    // Delay OneSignal initialization to prevent it from overlapping with modals
    // This gives the WelcomeGiftModal and other onboarding modals time to appear first
    const timer = setTimeout(() => {
      initOneSignal();
    }, 3000); // Wait 3 seconds before initializing

    return () => clearTimeout(timer);
  }, []);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/pwa-install" element={<ProtectedRoute><PWAInstall /></ProtectedRoute>} />
        <Route path="/pwa-check" element={<ProtectedRoute><PWACheck /></ProtectedRoute>} />
        <Route path="/theme-selection" element={<ProtectedRoute><ThemeSelection /></ProtectedRoute>} />
        <Route path="/notification-permission" element={<ProtectedRoute><NotificationPermission /></ProtectedRoute>} />
        <Route
          path="/refund"
          element={
            <ProtectedRoute>
              <RefundRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/refund-status"
          element={
            <ProtectedRoute>
              <RefundStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scripts"
          element={
            <ProtectedRoute>
              <Scripts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/script-requests"
          element={
            <ProtectedRoute>
              <ScriptRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/script-request-status"
          element={
            <ProtectedRoute>
              <ScriptRequestStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          }
        />
        <Route
          path="/community/create"
          element={
            <ProtectedRoute>
              <CreateGroupName />
            </ProtectedRoute>
          }
        />
        <Route
          path="/community/add-logo"
          element={
            <ProtectedRoute>
              <AddGroupLogo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/community/feed"
          element={
            <ProtectedRoute>
              <CommunityFeed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/community/create-post"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/community/members"
          element={
            <ProtectedRoute>
              <MembersList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/community/join"
          element={
            <ProtectedRoute>
              <JoinCommunity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/community/:inviteCode"
          element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tracker"
          element={
            <ProtectedRoute>
              <Tracker />
            </ProtectedRoute>
          }
        />
        {/* Redirect old progress route to tracker */}
        <Route path="/progress" element={<Navigate to="/tracker" replace />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <ProfileEdit />
            </ProtectedRoute>
          }
        />
        {/* Redirect old videos route to bonuses with video filter */}
        <Route path="/videos" element={<Navigate to="/bonuses?category=video" replace />} />
        {/* Redirect old library route to bonuses */}
        <Route path="/library" element={<Navigate to="/bonuses" replace />} />
        <Route
          path="/bonuses"
          element={
            <ProtectedRoute>
              <Bonuses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bonuses/collection/:slug"
          element={
            <ProtectedRoute>
              <CollectionDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listen"
          element={
            <ProtectedRoute>
              <Listen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listen/upgrade"
          element={
            <ProtectedRoute>
              <ListenUpgrade />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listen/:slug"
          element={
            <ProtectedRoute>
              <ListenSeries />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lessons"
          element={
            <ProtectedRoute>
              <Lessons />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ebook/:ebookId"
          element={
            <ProtectedRoute>
              <EbookReader />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/methodology"
          element={
            <ProtectedRoute>
              <Methodology />
            </ProtectedRoute>
          }
        />
        <Route
          path="/generate-welcome-pdf"
          element={
            <ProtectedRoute>
              <GenerateWelcomePDF />
            </ProtectedRoute>
          }
        />
        <Route
          path="/achievements"
          element={
            <ProtectedRoute>
              <Achievements />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/:userId"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        
        {/* Join Family - Public route for accepting invites */}
        <Route
          path="/join-family"
          element={
            <ProtectedRoute>
              <JoinFamily />
            </ProtectedRoute>
          }
        />
        
        {/* Legal Pages - Public */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <TooltipProvider>
            <NavigationProgress />
            <Toaster />
            <Sonner />
            <UpdatePrompt />
            <ChildProfilesProvider>
              <AudioPlayerProvider>
                <AppContent />
                <AudioPlayer />
              </AudioPlayerProvider>
            </ChildProfilesProvider>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
