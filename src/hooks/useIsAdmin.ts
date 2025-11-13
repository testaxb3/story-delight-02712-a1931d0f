import { useQuery } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client"; // Importar isSupabaseConfigured
import { useAuth } from "@/contexts/AuthContext";

// Remover a constante ALLOWED_ADMIN_EMAILS

export const useIsAdmin = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["is-admin", user?.id],
    queryFn: async () => {
      // Se não há usuário ou supabase não está configurado, não é admin
      if (!user || !isSupabaseConfigured) return false;

      try {
        // Consulta apenas a tabela profiles
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("is_admin") // Seleciona apenas a coluna necessária
          .eq("id", user.id)
          .maybeSingle(); // Usa maybeSingle para tratar caso o perfil não exista

        // Trata erro na consulta (exceto se for 'não encontrado', PGRST116)
        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Error fetching admin status from profiles:", profileError);
          return false; // Retorna false em caso de erro na consulta
        }

        // Retorna true se a coluna is_admin for explicitamente true
        return profileData?.is_admin === true;

      } catch (error) {
        console.error("Unexpected error in useIsAdmin:", error);
        return false; // Retorna false em caso de erro inesperado
      }
    },
    // Só executa se houver um usuário E supabase estiver configurado
    enabled: !!user && isSupabaseConfigured,
    staleTime: 5 * 60 * 1000, // Mantém o cache por 5 minutos
  });
};