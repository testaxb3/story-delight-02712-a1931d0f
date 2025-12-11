import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { isStandaloneMode } from '@/utils/platform';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (import.meta.env.DEV) {
    console.log('[ProtectedRoute] Estado atual:', {
      loading,
      hasUser: !!user,
      userId: user?.id,
      quiz_completed: user?.quiz_completed,
      pathname: location.pathname,
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-6xl animate-brain-pulse">🧠</div>
      </div>
    );
  }

  if (!user) {
    if (import.meta.env.DEV) console.log('[ProtectedRoute] NO USER - redirecionando para /auth');
    return <Navigate to="/auth" replace />;
  }

  // Admin-only route check
  if (requireAdmin && !user.is_admin) {
    return <Navigate to="/" replace />;
  }

  // Quiz exempt routes
  const quizExemptRoutes = ['/quiz', '/refund', '/refund-status'];
  const isQuizExempt = quizExemptRoutes.some(route => location.pathname.startsWith(route));

  // If quiz completed, allow access and ensure flags are set
  if (user.quiz_completed === true) {
    // Ensure localStorage flags are set for existing users
    if (!localStorage.getItem('onboarding_completed') && isStandaloneMode()) {
      localStorage.setItem('onboarding_completed', 'true');
    }
    return <>{children}</>;
  }

  // Grace period for just-completed quiz
  const quizCompletedAt = Number(sessionStorage.getItem('quizJustCompletedAt') || 0);
  const withinGracePeriod = quizCompletedAt > 0 && (Date.now() - quizCompletedAt) < 120000;

  if (withinGracePeriod) {
    return <>{children}</>;
  }

  // If not on quiz route and quiz not completed, redirect to quiz
  if (!isQuizExempt) {
    if (import.meta.env.DEV) console.log('[ProtectedRoute] ❌ Quiz NÃO completado - redirecionando para /quiz');
    return <Navigate to="/quiz" replace />;
  }

  return <>{children}</>;
}
