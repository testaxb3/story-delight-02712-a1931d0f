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
import { initOneSignal } from "./lib/onesignal";
import { initAnalytics } from "./lib/analytics";
import { usePageTracking } from "./hooks/usePageTracking";
import { useErrorTracking } from "./hooks/useErrorTracking";

// PERFORMANCE OPTIMIZATION: Eager load critical pages
import Auth from "./pages/Auth";
import Dashboard from "./pages/DashboardCalAI";
import NotFound from "./pages/NotFound";

// PERFORMANCE OPTIMIZATION: Lazy load non-critical pages for code splitting
// This reduces initial bundle size and improves Time to Interactive (TTI)
const PWAInstall = lazy(() => import("./pages/PWAInstall"));
const PWACheck = lazy(() => import("./pages/PWACheck"));
const ThemeSelection = lazy(() => import("./pages/ThemeSelection"));
const RefundRequest = lazy(() => import("./pages/RefundRequest"));
const RefundStatus = lazy(() => import("./pages/RefundStatus"));
const Scripts = lazy(() => import("./pages/Scripts"));
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
const Progress = lazy(() => import("./pages/ProgressCalAI"));
const Profile = lazy(() => import("./pages/ProfileCalAI"));
const ProfileEdit = lazy(() => import("./pages/Profile/Edit"));

const Bonuses = lazy(() => import("./pages/Bonuses"));
const EbookReader = lazy(() => import("./pages/EbookReader"));
const EbookReaderV2 = lazy(() => import("./pages/EbookReaderV2"));
const Admin = lazy(() => import("./pages/Admin"));
const Methodology = lazy(() => import("./pages/Methodology"));
const ScriptRequests = lazy(() => import("./pages/ScriptRequests"));
const GenerateWelcomePDF = lazy(() => import("./pages/GenerateWelcomePDF"));
const Achievements = lazy(() => import("./pages/Achievements"));
const UserProfile = lazy(() => import("./pages/UserProfile"));

// Tools
const RoutineBuilder = lazy(() => import("./pages/tools/RoutineBuilder"));
const RoutineEditor = lazy(() => import("./pages/tools/RoutineEditor"));
const RoutinePlayer = lazy(() => import("./pages/tools/RoutinePlayer"));

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
        <Route path="/pwa-install" element={<ProtectedRoute><PWAInstall /></ProtectedRoute>} />
        <Route path="/pwa-check" element={<ProtectedRoute><PWACheck /></ProtectedRoute>} />
        <Route path="/theme-selection" element={<ProtectedRoute><ThemeSelection /></ProtectedRoute>} />
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
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          }
        />
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
          path="/ebook/:ebookId"
          element={
            <ProtectedRoute>
              <EbookReader />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ebook-v2/:ebookId"
          element={
            <ProtectedRoute>
              <EbookReaderV2 />
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
        
        {/* Tool Routes */}
        <Route
          path="/tools/routine-builder"
          element={
            <ProtectedRoute>
              <RoutineBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tools/routine-builder/new"
          element={
            <ProtectedRoute>
              <RoutineEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tools/routine-builder/:routineId/edit"
          element={
            <ProtectedRoute>
              <RoutineEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tools/routine-builder/:routineId/play"
          element={
            <ProtectedRoute>
              <RoutinePlayer />
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
            <Toaster />
            <Sonner />
            <UpdatePrompt />
            <ChildProfilesProvider>
              <AppContent />
            </ChildProfilesProvider>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
