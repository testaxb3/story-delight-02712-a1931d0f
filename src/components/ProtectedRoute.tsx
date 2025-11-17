import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-6xl animate-brain-pulse">🧠</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Verificar se o quiz foi completado (exceto nas rotas de quiz e refund)
  const quizExemptRoutes = ['/quiz', '/refund', '/refund-status'];
  const isQuizRoute = quizExemptRoutes.some(route => location.pathname.startsWith(route));

  // Permitir navegação imediatamente após concluir o quiz (primeira navegação)
  const navState = location.state as { quizJustCompleted?: boolean } | null;
  const justCompleted = !!navState?.quizJustCompleted;
  
  // Check sessionStorage for recent quiz completion (5-minute TTL)
  // ✅ FIX: Extended from 2min to 5min to prevent premature expiration
  const quizCompletedAt = Number(sessionStorage.getItem('quizJustCompletedAt') || 0);
  const withinTTL = quizCompletedAt > 0 && (Date.now() - quizCompletedAt) < 300000; // 5 minutes (300000ms)

  // ✅ FIX: Clear sessionStorage if quiz is confirmed completed in database
  if (user.quiz_completed && quizCompletedAt > 0) {
    sessionStorage.removeItem('quizJustCompletedAt');
  }

  // ✅ NEW FIX: Handle inconsistent state (quiz_completed=true but quiz_in_progress=true)
  // This can happen from race conditions or incomplete updates
  const hasInconsistentState = user.quiz_completed && user.quiz_in_progress;
  
  // Debug log
  console.debug('[ProtectedRoute]', {
    path: location.pathname,
    quiz_completed: user.quiz_completed,
    quiz_in_progress: user.quiz_in_progress,
    hasInconsistentState,
    justCompleted,
    withinTTL,
    isQuizRoute
  });

  // ✅ FIX: If quiz is marked completed, ALWAYS allow access (even if in_progress is stuck)
  // Prioritize quiz_completed over quiz_in_progress to handle inconsistent states
  if (!isQuizRoute && !user.quiz_completed && !justCompleted && !withinTTL) {
    return <Navigate to="/quiz" replace />;
  }

  return <>{children}</>;
}
