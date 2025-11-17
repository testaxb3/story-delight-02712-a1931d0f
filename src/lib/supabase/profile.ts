// @ts-nocheck
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type NullableString = string | null | undefined;

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

type FetchProfileOptions = {
  select?: string;
};

/**
 * Busca o perfil de um usuário
 */
export const fetchProfile = async (
  userId: string,
  options: FetchProfileOptions = {}
): Promise<ProfileRow | null> => {
  const columns = options.select ?? "*";

  const { data, error } = await supabase
    .from("profiles")
    .select(columns)
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as ProfileRow | null) ?? null;
};

/**
 * Sanitiza uma string removendo espaços e retornando null se vazia
 */
const sanitizeString = (value: NullableString): string | null => {
  if (value === undefined || value === null) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

/**
 * Sanitiza um email para lowercase
 */
const sanitizeEmail = (email: NullableString): string | null => {
  const sanitized = sanitizeString(email);
  return sanitized ? sanitized.toLowerCase() : null;
};

/**
 * Obtém o usuário autenticado
 */
const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  return user;
};

/**
 * Constrói o payload para upsert do perfil
 */
const buildProfileUpsertPayload = (
  userId: string,
  {
    childName,
    childProfile,
    quizCompleted,
    parentName,
    email,
  }: SaveChildProfilePayload
): Partial<ProfileRow> & { id: string } => {
  const payload: Partial<ProfileRow> & { id: string } = {
    id: userId,
    subscription_status: 'premium', // Todos os usuários iniciais são premium
  };

  const sanitizedChildName = sanitizeString(childName);
  if (sanitizedChildName !== null) {
    payload.child_name = sanitizedChildName;
  }

  const sanitizedParentName = sanitizeString(parentName);
  if (sanitizedParentName !== null) {
    payload.name = sanitizedParentName;
  }

  const sanitizedEmail = sanitizeEmail(email);
  if (sanitizedEmail !== null) {
    payload.email = sanitizedEmail;
  }

  const sanitizedProfile = sanitizeString(childProfile);
  if (sanitizedProfile !== null) {
    payload.child_profile = sanitizedProfile;
  }

  // Only set quiz_completed if explicitly provided
  if (quizCompleted !== undefined) {
    payload.quiz_completed = quizCompleted;
  }

  return payload;
};

/**
 * Constrói o payload para upsert do progresso do usuário
 */
const buildProgressUpsertPayload = (
  userId: string,
  {
    childProfile,
    quizCompleted,
  }: SaveChildProfilePayload
): Partial<Database["public"]["Tables"]["user_progress"]["Insert"]> => {
  const payload: Partial<Database["public"]["Tables"]["user_progress"]["Insert"]> = {
    user_id: userId,
  };

  // Only set quiz_completed if explicitly provided
  if (quizCompleted !== undefined) {
    payload.quiz_completed = quizCompleted;
  }

  const sanitizedProfile = sanitizeString(childProfile);
  if (sanitizedProfile !== null) {
    payload.child_profile = sanitizedProfile;
  }

  return payload;
};

/**
 * Cria um perfil padrão em caso de falha no upsert
 */
const buildDefaultProfile = (
  userId: string,
  {
    childName,
    childProfile,
    quizCompleted,
    parentName,
    email,
  }: SaveChildProfilePayload
): ProfileRow => {
  return {
    id: userId,
    child_name: sanitizeString(childName),
    child_profile: sanitizeString(childProfile),
    created_at: new Date().toISOString(),
    email: sanitizeEmail(email),
    is_admin: false,
    name: sanitizeString(parentName),
    subscription_status: 'premium',
    quiz_completed: quizCompleted ?? false,
    role: null,
    updated_at: new Date().toISOString(),
  } as ProfileRow;
};

/**
 * Faz upsert do perfil no banco de dados
 */
const upsertProfileInDatabase = async (
  payload: Partial<ProfileRow> & { id: string }
): Promise<ProfileRow | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as ProfileRow | null) ?? null;
};

/**
 * Faz upsert do progresso do usuário
 */
const upsertUserProgress = async (
  payload: Partial<Database["public"]["Tables"]["user_progress"]["Insert"]>
): Promise<void> => {
  const { error } = await supabase
    .from("user_progress")
    .upsert(payload, { onConflict: "user_id" });

  if (error) {
    throw error;
  }
};

type SaveChildProfilePayload = {
  childName?: string | null;
  childProfile?: string | null;
  quizCompleted?: boolean;
  parentName?: string | null;
  email?: string | null;
};

/**
 * Salva o perfil da criança usando uma função RPC
 * Se a função RPC não existir, usa o fallback
 */
export const saveChildProfile = async ({
  childName,
  childProfile,
  quizCompleted,
  parentName,
  email,
}: SaveChildProfilePayload = {}): Promise<ProfileRow> => {
  // Prevent overwriting quiz_completed when not explicitly provided
  if (quizCompleted === undefined) {
    return await fallbackSaveChildProfile({
      childName,
      childProfile,
      quizCompleted,
      parentName,
      email,
    });
  }

  const { data, error } = await supabase.rpc("save_child_profile", {
    child_name: childName ?? null,
    child_profile: childProfile ?? null,
    quiz_completed: quizCompleted, // do not default to false
    parent_name: parentName ?? null,
    email: email ?? null,
  });

  if (!error) {
    return data as ProfileRow;
  }

  const isMissingFunction = error.code === "42883" || error.message?.includes("save_child_profile");

  if (!isMissingFunction) {
    throw error;
  }

  // Usar fallback se a função RPC não existir
  return await fallbackSaveChildProfile({
    childName,
    childProfile,
    quizCompleted,
    parentName,
    email,
  });
};

/**
 * Fallback para saveChildProfile quando a função RPC não está disponível
 * Realiza as mesmas operações manualmente
 */
const fallbackSaveChildProfile = async (
  payload: SaveChildProfilePayload
): Promise<ProfileRow> => {
  // Obter usuário autenticado
  const user = await getCurrentUser();

  // Construir payloads
  const profilePayload = buildProfileUpsertPayload(user.id, payload);
  const progressPayload = buildProgressUpsertPayload(user.id, payload);

  // Fazer upsert do perfil
  const profileData = await upsertProfileInDatabase(profilePayload);

  // Fazer upsert do progresso
  await upsertUserProgress(progressPayload);

  // Retornar perfil ou padrão
  return profileData ?? buildDefaultProfile(user.id, payload);
};

/**
 * Atualiza os detalhes do pai/responsável
 */
export const upsertParentDetails = async (
  userId: string,
  payload: { name?: string | null; email?: string | null }
): Promise<ProfileRow> => {
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: userId,
        name: sanitizeString(payload.name),
        email: sanitizeEmail(payload.email),
      },
      { onConflict: "id" }
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as ProfileRow;
};

