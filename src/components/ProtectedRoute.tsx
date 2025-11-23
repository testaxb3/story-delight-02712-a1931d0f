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

  // Check if PWA flow is completed (before quiz)
  const pwaFlowCompleted = localStorage.getItem('pwa_flow_completed') === 'true';
  const isPWARoute = ['/pwa-install', '/pwa-check'].includes(location.pathname);
  
  // Verificar se o quiz foi completado (exceto nas rotas de quiz e refund)
  const quizExemptRoutes = ['/quiz', '/refund', '/refund-status', '/pwa-install', '/pwa-check', '/theme-selection'];
  const isQuizRoute = quizExemptRoutes.some(route => location.pathname.startsWith(route));

  console.log('[ProtectedRoute] É rota de quiz?', isQuizRoute);
  console.log('[ProtectedRoute] PWA flow completed?', pwaFlowCompleted);

  // 🔄 PWA Flow Check: If user hasn't completed PWA flow, redirect to installation
  if (!pwaFlowCompleted && !isPWARoute && !isQuizRoute) {
    console.log('[ProtectedRoute] ⚠️ PWA flow não completado - redirecionando para /pwa-install');
    return <Navigate to="/pwa-install" replace />;
  }

  // 🎨 Theme Selection Check: If PWA flow completed but theme not selected, redirect to theme selection
  const themeSelected = localStorage.getItem('theme_selected') === 'true';
  const isThemeRoute = location.pathname === '/theme-selection';

  if (pwaFlowCompleted && !themeSelected && !isThemeRoute && !isQuizRoute) {
    console.log('[ProtectedRoute] ⚠️ Tema não selecionado - redirecionando para /theme-selection');
    return <Navigate to="/theme-selection" replace />;
  }

  // ✅ CRÍTICO: Se o usuário completou o quiz no banco de dados, SEMPRE permitir acesso
  // Isso resolve loops de redirecionamento causados por cache stale
  if (user.quiz_completed) {
    console.log('[ProtectedRoute] ✅ Quiz COMPLETADO no DB - permitindo acesso');
    // Limpar sessionStorage se quiz confirmado completo
    if (sessionStorage.getItem('quizJustCompletedAt')) {
      sessionStorage.removeItem('quizJustCompletedAt');
      console.log('[ProtectedRoute] 🧹 Limpou sessionStorage (quiz confirmado no DB)');
    }
    return <>{children}</>;
  }

  // ✅ FIX: Permitir navegação imediatamente após concluir quiz (janela de 5 minutos)
  const quizCompletedAt = Number(sessionStorage.getItem('quizJustCompletedAt') || 0);
  const withinGracePeriod = quizCompletedAt > 0 && (Date.now() - quizCompletedAt) < 300000; // 5 minutos
  
  if (withinGracePeriod) {
    console.log('[ProtectedRoute] ✅ Quiz recém-completado (grace period) - permitindo acesso');
    return <>{children}</>;
  }

  // Se não completou o quiz E não está em rota de quiz E não está no grace period, redirecionar
  if (!isQuizRoute) {
    console.log('[ProtectedRoute] ❌ Quiz NÃO completado - redirecionando para /quiz');
    return <Navigate to="/quiz" replace />;
  }

  // Se está na rota de quiz, permitir acesso
  console.log('[ProtectedRoute] ✅ Rota de quiz - permitindo acesso');
  return <>{children}</>;
}
