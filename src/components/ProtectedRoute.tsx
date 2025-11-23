import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 🔍 DEBUG: Log detalhado para diagnosticar problema
  console.log('[ProtectedRoute] Estado atual:', {
    loading,
    hasUser: !!user,
    userId: user?.id,
    email: user?.email,
    quiz_completed: user?.quiz_completed,
    quiz_in_progress: user?.quiz_in_progress,
    pathname: location.pathname
  });

  if (loading) {
    console.log('[ProtectedRoute] LOADING - mostrando spinner');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-6xl animate-brain-pulse">🧠</div>
      </div>
    );
  }

  if (!user) {
    console.log('[ProtectedRoute] NO USER - redirecionando para /auth');
    return <Navigate to="/auth" replace />;
  }

  // Verificar se o quiz foi completado (exceto nas rotas de quiz e refund)
  const quizExemptRoutes = ['/quiz', '/refund', '/refund-status'];
  const isQuizRoute = quizExemptRoutes.some(route => location.pathname.startsWith(route));

  console.log('[ProtectedRoute] É rota de quiz?', isQuizRoute);

  // ✅ CRÍTICO: Se o usuário completou o quiz no banco de dados, SEMPRE permitir acesso
  // Isso resolve loops de redirecionamento causados por cache stale
  if (user.quiz_completed) {
    console.log('[ProtectedRoute] ✅ Quiz COMPLETADO no DB - permitindo acesso');
    return <>{children}</>;
  }

  // Se não completou o quiz E não está em rota de quiz, redirecionar
  if (!isQuizRoute) {
    console.log('[ProtectedRoute] ❌ Quiz NÃO completado - redirecionando para /quiz');
    return <Navigate to="/quiz" replace />;
  }

  // Se está na rota de quiz, permitir acesso
  console.log('[ProtectedRoute] ✅ Rota de quiz - permitindo acesso');
  return <>{children}</>;
}
