import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ChildProfilesProvider } from "./contexts/ChildProfilesContext";
import { initOneSignal } from "./lib/onesignal";

// PERFORMANCE OPTIMIZATION: Eager load critical pages
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// PERFORMANCE OPTIMIZATION: Lazy load non-critical pages for code splitting
// This reduces initial bundle size and improves Time to Interactive (TTI)
const PWAOnboarding = lazy(() => import("./pages/PWAOnboarding"));
const RefundRequest = lazy(() => import("./pages/RefundRequest"));
const RefundStatus = lazy(() => import("./pages/RefundStatus"));
const Scripts = lazy(() => import("./pages/Scripts"));
const Quiz = lazy(() => import("./pages/Quiz"));
const Community = lazy(() => import("./pages/Community"));
const Tracker = lazy(() => import("./pages/Tracker"));
const Profile = lazy(() => import("./pages/Profile"));
const Videos = lazy(() => import("./pages/Videos"));
const Library = lazy(() => import("./pages/Library"));
const Bonuses = lazy(() => import("./pages/Bonuses"));
const EbookReader = lazy(() => import("./pages/EbookReader"));
const EbookLibrary = lazy(() => import("./pages/EbookLibrary"));
const Admin = lazy(() => import("./pages/Admin"));
const Methodology = lazy(() => import("./pages/Methodology"));

// Loading fallback component for Suspense
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const queryClient = new QueryClient();

function AppContent() {
  useEffect(() => {
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
        <Route path="/onboarding" element={<PWAOnboarding />} />
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
          path="/quiz"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
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
          path="/tracker"
          element={
            <ProtectedRoute>
              <Tracker />
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
          path="/videos"
          element={
            <ProtectedRoute>
              <Videos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/library"
          element={
            <ProtectedRoute>
              <Library />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bonuses"
          element={
            <ProtectedRoute>
              <Bonuses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ebooks"
          element={
            <ProtectedRoute>
              <EbookLibrary />
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
          path="/ebook"
          element={
            <ProtectedRoute>
              <EbookReader />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <Dashboard />
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
