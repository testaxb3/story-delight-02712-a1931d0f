const MissingSupabaseConfig = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-6 text-white">
      <div className="max-w-xl w-full space-y-6 rounded-3xl bg-white/10 p-10 shadow-2xl backdrop-blur">
        <div className="text-5xl">⚙️</div>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold">Connect Supabase to continue</h1>
          <p className="text-base text-white/80">
            As variáveis VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY precisam ser configuradas nos Secrets do projeto Lovable.
          </p>
          <p className="text-sm text-white/60">
            The keys can be found in your Supabase project dashboard. See the
            <span className="font-semibold"> docs/supabase-setup.md </span>
            file for step-by-step instructions.
          </p>
        </div>
        <div className="rounded-2xl bg-black/40 p-5 text-sm font-mono">
          <p className="mb-2 text-xs uppercase tracking-wide text-white/40">Configuration example:</p>
          <pre className="whitespace-pre-wrap">
{`VITE_SUPABASE_URL="https://<your-instance>.supabase.co"\nVITE_SUPABASE_PUBLISHABLE_KEY="<your-api-key>"`}
          </pre>
        </div>
        <p className="text-xs text-white/50">
          After saving the <code>.env</code> file, restart the development server to apply the changes.
        </p>
      </div>
    </div>
  );
};

export default MissingSupabaseConfig;
