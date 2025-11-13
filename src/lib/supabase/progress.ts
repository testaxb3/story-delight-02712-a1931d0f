import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { ensureTrackerDays } from "./scaffolding";

type UserProgressRow = Database["public"]["Tables"]["user_progress"]["Row"];
type TrackerDayRow = Database["public"]["Tables"]["tracker_days"]["Row"];

type RecordScriptUsageParams = {
  userId: string;
  scriptId: string;
  fallbackChildProfile?: string | null;
};

const CHECK_IN_WINDOW_MS = 36 * 60 * 60 * 1000;

const toDayKey = (date: Date): string => date.toISOString().split("T")[0];

export const computeNextStreak = (
  lastCheckIn: string | null | undefined,
  now: Date,
  previousStreak: number | null | undefined,
): number => {
  if (!lastCheckIn) {
    return 1;
  }

  const lastCheck = new Date(lastCheckIn);
  const sameDay = toDayKey(lastCheck) === toDayKey(now);

  if (sameDay) {
    return previousStreak ?? 1;
  }

  const withinWindow = now.getTime() - lastCheck.getTime() <= CHECK_IN_WINDOW_MS;
  return withinWindow ? (previousStreak ?? 0) + 1 : 1;
};

export const fetchUserProgress = async (userId: string): Promise<UserProgressRow | null> => {
  if (!isSupabaseConfigured) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("user_progress")
      .select("user_id, scripts_used, last_check_in, streak, child_profile, videos_watched, quiz_completed")
      .eq("user_id", userId)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching user progress:", error);
      throw error;
    }

    return (data ?? null) as UserProgressRow | null;
  } catch (error) {
    console.error("Unexpected error in fetchUserProgress:", error);
    return null;
  }
};

export const upsertUserProgress = async (progress: Partial<UserProgressRow> & { user_id: string }) => {
  if (!isSupabaseConfigured) {
    return;
  }

  try {
    const { error } = await supabase
      .from("user_progress")
      .upsert(progress, {
        onConflict: "user_id",
      });

    if (error) {
      console.error("Error upserting user progress:", error);
      throw error;
    }
  } catch (error) {
    console.error("Unexpected error in upsertUserProgress:", error);
  }
};

const updateTrackerDay = async (userId: string, now: Date) => {
  if (!isSupabaseConfigured) {
    return;
  }

  const fetchTrackerDays = async (): Promise<TrackerDayRow[]> => {
    const { data, error } = await supabase
      .from("tracker_days")
      .select("id, completed, day_number")
      .eq("user_id", userId)
      .order("day_number", { ascending: true });

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return (data ?? []) as TrackerDayRow[];
  };

  try {
    let trackerDays = await fetchTrackerDays();

    if (trackerDays.length === 0) {
      await ensureTrackerDays(userId);
      trackerDays = await fetchTrackerDays();
    }

    if (trackerDays.length === 0) {
      console.warn(`No tracker days found for user ${userId} to update.`);
      return;
    }

    const nextDay = trackerDays.find((day) => !day.completed);

    if (!nextDay) {
      console.log(`All tracker days completed or no next day found for user ${userId}.`);
      return;
    }

    const { error: updateError } = await supabase
      .from("tracker_days")
      .update({ completed: true, completed_at: now.toISOString() })
      .eq("id", nextDay.id);

    if (updateError) {
      console.error(`Error updating tracker day ${nextDay.day_number} for user ${userId}:`, updateError);
      throw updateError;
    }

    console.log(`Successfully updated tracker day ${nextDay.day_number} for user ${userId}.`);
  } catch (error) {
    console.error("Unexpected error in updateTrackerDay:", error);
  }
};

export const recordScriptUsage = async ({
  userId,
  scriptId,
  fallbackChildProfile = null,
}: RecordScriptUsageParams): Promise<void> => {
  if (!isSupabaseConfigured) {
    return;
  }

  const now = new Date();

  try {
    const progressRow = await fetchUserProgress(userId);
    const nextStreak = computeNextStreak(progressRow?.last_check_in, now, progressRow?.streak);
    const scriptsUsed = (progressRow?.scripts_used ?? 0) + 1;
    const childProfile = progressRow?.child_profile ?? fallbackChildProfile ?? undefined;

    const progressPayload: Partial<UserProgressRow> & { user_id: string } = {
      user_id: userId,
      scripts_used: scriptsUsed,
      last_check_in: now.toISOString(),
      streak: nextStreak,
      ...(childProfile ? { child_profile: childProfile } : {}),
      ...(progressRow?.quiz_completed !== undefined ? { quiz_completed: progressRow.quiz_completed } : {}),
      ...(progressRow?.videos_watched ? { videos_watched: progressRow.videos_watched } : {}),
    };

    await upsertUserProgress(progressPayload);

    const { error: usageError } = await supabase.from("script_usage").insert({
      user_id: userId,
      script_id: scriptId,
      used_at: now.toISOString(),
    });

    if (usageError) {
      console.error("Error inserting script usage:", usageError);
      throw usageError;
    }

    await updateTrackerDay(userId, now);
  } catch (error) {
    console.error("Failed to record script usage:", error);
  }
};

export const updateCheckInStreak = async (userId: string, now: Date): Promise<number | null> => {
  if (!isSupabaseConfigured) {
    return null;
  }

  try {
    const progressRow = await fetchUserProgress(userId);
    const nextStreak = computeNextStreak(progressRow?.last_check_in, now, progressRow?.streak);

    const progressPayload: Partial<UserProgressRow> & { user_id: string } = {
      user_id: userId,
      last_check_in: now.toISOString(),
      streak: nextStreak,
      ...(progressRow?.scripts_used !== undefined ? { scripts_used: progressRow.scripts_used } : {}),
      ...(progressRow?.child_profile ? { child_profile: progressRow.child_profile } : {}),
      ...(progressRow?.quiz_completed !== undefined ? { quiz_completed: progressRow.quiz_completed } : {}),
      ...(progressRow?.videos_watched ? { videos_watched: progressRow.videos_watched } : {}),
    };

    await upsertUserProgress(progressPayload);
    return nextStreak;
  } catch (error) {
    console.error("Failed to update check-in streak:", error);
    return null;
  }
};


export const getLastCompletedDay = async (userId: string): Promise<TrackerDayRow | null> => {
  if (!isSupabaseConfigured) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("tracker_days")
      .select("completed_at")
      .eq("user_id", userId)
      .eq("completed", true)
      .order("completed_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching last completed day:", error);
      throw error;
    }

    return (data ?? null) as TrackerDayRow | null;
  } catch (error) {
    console.error("Unexpected error in getLastCompletedDay:", error);
    return null;
  }
};

