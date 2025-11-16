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
  
  if (!isQuizRoute && !user.quiz_completed && !justCompleted) {
    return <Navigate to="/quiz" replace />;
  }

  return <>{children}</>;
}
