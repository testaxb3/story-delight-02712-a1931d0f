import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RefreshCw, Loader2, AlertTriangle, CheckCircle2, Settings } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function AdminSystemTab() {
  const [updating, setUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('Nova atualização disponível! Por favor, atualize o app.');

  const handleForceUpdate = async () => {
    setUpdating(true);

    try {
      const { data, error } = await supabase.rpc('force_app_update', {
        update_message: updateMessage
      });

      if (error) {
        throw error;
      }

      toast.success(
        data.message || 'Atualização forçada com sucesso!',
        {
          description: `Versão: ${data.new_version} (Build #${data.build})`,
          icon: <CheckCircle2 className="w-5 h-5" />,
          duration: 5000,
        }
      );

      // Reset message
      setUpdateMessage('Nova atualização disponível! Por favor, atualize o app.');
    } catch (error: any) {
      console.error('Error forcing update:', error);
      toast.error(
        'Erro ao forçar atualização',
        {
          description: error.message || 'Tente novamente mais tarde',
          icon: <AlertTriangle className="w-5 h-5" />,
        }
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="w-5 h-5" />
        <h2 className="text-2xl font-bold">Configurações do Sistema</h2>
      </div>

      {/* Force App Update Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Forçar Atualização do PWA
          </CardTitle>
          <CardDescription>
            Force todos os usuários a atualizarem o aplicativo PWA, limpando o cache e carregando a versão mais recente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="updateMessage">
              Mensagem de Atualização
            </Label>
            <Input
              id="updateMessage"
              value={updateMessage}
              onChange={(e) => setUpdateMessage(e.target.value)}
              placeholder="Digite a mensagem que os usuários verão..."
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground">
              Esta mensagem será exibida no diálogo de atualização.
            </p>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                  Atenção!
                </p>
                <p className="text-yellow-800 dark:text-yellow-200">
                  Esta ação irá:
                </p>
                <ul className="list-disc list-inside space-y-1 text-yellow-800 dark:text-yellow-200 ml-2">
                  <li>Incrementar a versão do app</li>
                  <li>Forçar todos os usuários a verem um diálogo de atualização</li>
                  <li>Limpar o cache do PWA quando atualizarem</li>
                  <li>Recarregar a página para a nova versão</li>
                </ul>
              </div>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="w-full gap-2"
                size="lg"
                disabled={updating}
              >
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Forçar Atualização Global
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  Confirmar Atualização Global
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p>
                    Você está prestes a forçar uma atualização para <strong>todos os usuários</strong> do aplicativo.
                  </p>
                  <p className="text-sm">
                    Mensagem: "{updateMessage}"
                  </p>
                  <p className="font-semibold text-foreground">
                    Deseja continuar?
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleForceUpdate}
                  className="bg-primary hover:bg-primary/90"
                >
                  Sim, Forçar Atualização
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* System Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Sistema</CardTitle>
          <CardDescription>
            Detalhes sobre a configuração atual do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Ambiente:</span>
              <span className="font-semibold">
                {import.meta.env.DEV ? 'Desenvolvimento' : 'Produção'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Modo:</span>
              <span className="font-semibold">{import.meta.env.MODE}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">PWA:</span>
              <span className="font-semibold">
                {'serviceWorker' in navigator ? 'Ativado' : 'Desativado'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
