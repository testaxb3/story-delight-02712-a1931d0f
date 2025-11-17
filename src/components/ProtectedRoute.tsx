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
  
  // Check sessionStorage for recent quiz completion (2-minute TTL)
  const quizCompletedAt = Number(sessionStorage.getItem('quizJustCompletedAt') || 0);
  const withinTTL = quizCompletedAt > 0 && (Date.now() - quizCompletedAt) < 120000; // 2 minutes

  // ✅ FIX: Clear sessionStorage if quiz is confirmed completed in database
  if (user.quiz_completed && quizCompletedAt > 0) {
    sessionStorage.removeItem('quizJustCompletedAt');
  }

  // Debug log
  console.debug('[ProtectedRoute]', {
    path: location.pathname,
    quiz_completed: user.quiz_completed,
    quiz_in_progress: user.quiz_in_progress,
    justCompleted,
    withinTTL,
    isQuizRoute
  });

  // ✅ FIX: More strict check - redirect to quiz ONLY if definitely not completed
  // This prevents false positives from stale cache
  if (!isQuizRoute && !user.quiz_completed && !justCompleted && !withinTTL) {
    return <Navigate to="/quiz" replace />;
  }

  return <>{children}</>;
}
