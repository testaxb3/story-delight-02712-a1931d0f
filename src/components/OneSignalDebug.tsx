import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getPlayerId,
  isSubscribed,
  isOneSignalInitialized,
  showPermissionPrompt
} from '@/lib/onesignal';
import { RefreshCw, CheckCircle2, XCircle, AlertCircle, Bell } from 'lucide-react';

/**
 * OneSignal Debug Component
 *
 * Exibe informações de debug sobre o estado do OneSignal
 * Use este componente no Profile ou Admin para diagnosticar problemas
 */
export function OneSignalDebug() {
  const [debugInfo, setDebugInfo] = useState({
    appId: import.meta.env.VITE_ONESIGNAL_APP_ID || 'NOT_SET',
    restApiKey: import.meta.env.VITE_ONESIGNAL_REST_API_KEY ? 'SET' : 'NOT_SET',
    initialized: false,
    playerId: null as string | null,
    subscribed: false,
    browserSupport: true,
    permission: 'default' as NotificationPermission,
    serviceWorkerExists: false,
    loading: true,
  });

  const checkStatus = async () => {
    setDebugInfo(prev => ({ ...prev, loading: true }));

    try {
      // Check browser support
      const browserSupport = 'Notification' in window && 'serviceWorker' in navigator;

      // Check permission
      const permission = browserSupport ? Notification.permission : 'denied';

      // Check if OneSignal Service Worker file exists
      let serviceWorkerExists = false;
      try {
        const response = await fetch('/OneSignalSDKWorker.js', { method: 'HEAD' });
        serviceWorkerExists = response.ok;
      } catch (error) {
        console.error('[OneSignalDebug] Failed to check Service Worker file:', error);
      }

      // Check OneSignal
      const initialized = isOneSignalInitialized();
      const subscribed = await isSubscribed();
      const playerId = await getPlayerId();

      setDebugInfo({
        appId: import.meta.env.VITE_ONESIGNAL_APP_ID || 'NOT_SET',
        restApiKey: import.meta.env.VITE_ONESIGNAL_REST_API_KEY ? 'SET' : 'NOT_SET',
        initialized,
        playerId,
        subscribed,
        browserSupport,
        permission,
        serviceWorkerExists,
        loading: false,
      });
    } catch (error) {
      console.error('[OneSignalDebug] Error checking status:', error);
      setDebugInfo(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleRequestPermission = async () => {
    try {
      await showPermissionPrompt();
      // Wait a bit for OneSignal to update
      setTimeout(checkStatus, 1000);
    } catch (error) {
      console.error('[OneSignalDebug] Error requesting permission:', error);
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle2 className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Bell className="w-5 h-5" />
          OneSignal Debug
        </h3>
        <Button
          size="sm"
          variant="outline"
          onClick={checkStatus}
          disabled={debugInfo.loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${debugInfo.loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      <div className="space-y-3">
        {/* Configuração */}
        <div className="border-b pb-3">
          <h4 className="text-sm font-medium mb-2">Configuração</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">App ID:</span>
              <Badge variant={debugInfo.appId !== 'NOT_SET' ? 'default' : 'destructive'}>
                {debugInfo.appId === 'NOT_SET' ? 'NÃO CONFIGURADO' : debugInfo.appId.substring(0, 20) + '...'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">REST API Key:</span>
              <Badge variant={debugInfo.restApiKey === 'SET' ? 'default' : 'secondary'}>
                {debugInfo.restApiKey}
              </Badge>
            </div>
          </div>
        </div>

        {/* Status do Navegador */}
        <div className="border-b pb-3">
          <h4 className="text-sm font-medium mb-2">Navegador</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Suporte a Push:</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(debugInfo.browserSupport)}
                <span>{debugInfo.browserSupport ? 'Sim' : 'Não'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Service Worker File:</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(debugInfo.serviceWorkerExists)}
                <span>{debugInfo.serviceWorkerExists ? 'Existe' : 'Não encontrado'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Permissão:</span>
              <Badge
                variant={
                  debugInfo.permission === 'granted' ? 'default' :
                  debugInfo.permission === 'denied' ? 'destructive' :
                  'secondary'
                }
              >
                {debugInfo.permission === 'granted' ? 'Concedida' :
                 debugInfo.permission === 'denied' ? 'Negada' :
                 'Não solicitada'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Status do OneSignal */}
        <div className="border-b pb-3">
          <h4 className="text-sm font-medium mb-2">OneSignal</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Inicializado:</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(debugInfo.initialized)}
                <span>{debugInfo.initialized ? 'Sim' : 'Não'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Inscrito:</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(debugInfo.subscribed)}
                <span>{debugInfo.subscribed ? 'Sim' : 'Não'}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">Player ID:</span>
              <code className="text-xs bg-muted p-2 rounded break-all">
                {debugInfo.playerId || 'Nenhum'}
              </code>
            </div>
          </div>
        </div>

        {/* Diagnóstico */}
        <div className="bg-muted/50 p-3 rounded-lg">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Diagnóstico
          </h4>
          <div className="text-xs text-muted-foreground space-y-1">
            {debugInfo.appId === 'NOT_SET' && (
              <p className="text-yellow-600 dark:text-yellow-500">
                ⚠️ App ID não configurado. Adicione VITE_ONESIGNAL_APP_ID no Vercel.
              </p>
            )}
            {!debugInfo.serviceWorkerExists && (
              <p className="text-red-600 dark:text-red-500">
                ❌ Arquivo OneSignalSDKWorker.js não encontrado. Faça um novo deploy do código.
              </p>
            )}
            {!debugInfo.browserSupport && (
              <p className="text-red-600 dark:text-red-500">
                ❌ Seu navegador não suporta push notifications.
              </p>
            )}
            {!debugInfo.initialized && debugInfo.appId !== 'NOT_SET' && (
              <p className="text-yellow-600 dark:text-yellow-500">
                ⚠️ OneSignal não inicializou. Verifique o console para erros.
              </p>
            )}
            {debugInfo.permission === 'denied' && (
              <p className="text-red-600 dark:text-red-500">
                ❌ Permissão negada. Você precisa permitir notificações nas configurações do navegador.
              </p>
            )}
            {debugInfo.permission === 'default' && debugInfo.initialized && (
              <p className="text-blue-600 dark:text-blue-500">
                ℹ️ Permissão não solicitada ainda. Clique no botão abaixo para solicitar.
              </p>
            )}
            {debugInfo.subscribed && debugInfo.playerId && debugInfo.serviceWorkerExists && (
              <p className="text-green-600 dark:text-green-500">
                ✅ Tudo OK! Você está inscrito e receberá notificações.
              </p>
            )}
            {debugInfo.appId !== 'NOT_SET' && debugInfo.serviceWorkerExists && debugInfo.initialized && !debugInfo.subscribed && (
              <p className="text-blue-600 dark:text-blue-500">
                ℹ️ OneSignal configurado corretamente. Aguardando inscrição do usuário.
              </p>
            )}
          </div>
        </div>

        {/* Ações */}
        {debugInfo.permission === 'default' && debugInfo.initialized && (
          <Button
            className="w-full"
            onClick={handleRequestPermission}
          >
            <Bell className="w-4 h-4 mr-2" />
            Solicitar Permissão
          </Button>
        )}
      </div>
    </Card>
  );
}
