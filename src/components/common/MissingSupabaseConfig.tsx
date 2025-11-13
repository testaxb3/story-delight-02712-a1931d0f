import { SUPABASE_CONFIG_ERROR_MESSAGE } from "@/integrations/supabase/client";

const MissingSupabaseConfig = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-6 text-white">
      <div className="max-w-xl w-full space-y-6 rounded-3xl bg-white/10 p-10 shadow-2xl backdrop-blur">
        <div className="text-5xl">⚙️</div>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold">Conecte o Supabase para continuar</h1>
          <p className="text-base text-white/80">
            {SUPABASE_CONFIG_ERROR_MESSAGE}
          </p>
          <p className="text-sm text-white/60">
            As chaves podem ser encontradas no painel do seu projeto Supabase. Veja o arquivo
            <span className="font-semibold"> docs/supabase-setup.md </span>
            para instruções passo a passo.
          </p>
        </div>
        <div className="rounded-2xl bg-black/40 p-5 text-sm font-mono">
          <p className="mb-2 text-xs uppercase tracking-wide text-white/40">Exemplo de configuração:</p>
          <pre className="whitespace-pre-wrap">
{`VITE_SUPABASE_URL="https://<sua-instancia>.supabase.co"\nVITE_SUPABASE_PUBLISHABLE_KEY="<sua-api-key>"`}
          </pre>
        </div>
        <p className="text-xs text-white/50">
          Depois de salvar o arquivo <code>.env</code>, reinicie o servidor de desenvolvimento para aplicar as mudanças.
        </p>
      </div>
    </div>
  );
};

export default MissingSupabaseConfig;
