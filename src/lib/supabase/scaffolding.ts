import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { saveChildProfile } from "@/lib/supabase/profile";

const TOTAL_TRACKER_DAYS = 30;

type TrackerDayRow = Database["public"]["Tables"]["tracker_days"]["Row"];

type AuthDestination = "dashboard" | "quiz";

export async function ensureTrackerDays(userId: string) {
  try {
    const { data, error } = await supabase
      .from("tracker_days")
      .select("day_number")
      .eq("user_id", userId)
      .order("day_number", { ascending: true });

    if (error && error.code !== "PGRST116") {
      console.warn("Supabase error checking tracker days:", error.code, error.message);
      return;
    }

    const existingDays = new Set((data ?? []).map((day) => (day as Pick<TrackerDayRow, "day_number">).day_number));
    const missingDays = Array.from({ length: TOTAL_TRACKER_DAYS }, (_, index) => index + 1).filter(
      (dayNumber) => !existingDays.has(dayNumber),
    );

    if (missingDays.length === 0) {
      return;
    }

    const payload = missingDays.map((dayNumber) => ({
      user_id: userId,
      day_number: dayNumber,
      completed: false,
    }));

    const { error: insertError } = await supabase.from("tracker_days").insert(payload);

    if (insertError) {
      console.error(`Failed to insert tracker days for user ${userId}`, insertError);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn("Tracker day setup skipped or failed:", message);
  }
}

export async function ensureUserScaffolding(userId: string, email: string) {
  const normalizedEmail = email.toLowerCase();
  const defaultName = normalizedEmail.split("@")[0] ?? "Parent";

  try {
    // Check if profile already exists with a custom name
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", userId)
      .maybeSingle();

    // Only scaffold if profile doesn't exist or has no name set
    // Don't overwrite user-customized names!
    if (!existingProfile || !existingProfile.name || existingProfile.name === defaultName) {
      await saveChildProfile({
        parentName: defaultName,
        email: normalizedEmail,
      });

      console.log(`Profile scaffolded or updated for user ${userId}.`);
    } else {
      console.log(`Profile already exists with custom name for user ${userId}, skipping scaffold.`);
    }
  } catch (error) {
    console.error(`Failed to scaffold profile information for user ${userId}`, error);
  }

  await ensureTrackerDays(userId);
}

export async function resolveAuthDestination(userId: string): Promise<AuthDestination> {
  try {
    const { data: progressData, error } = await supabase
      .from("user_progress")
      .select("quiz_completed")
      .eq("user_id", userId)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error(`Error fetching user progress for ${userId}`, error);
      return "dashboard";
    }

    return progressData?.quiz_completed ? "dashboard" : "quiz";
  } catch (error) {
    console.error(`Unexpected error resolving destination for ${userId}`, error);
    return "dashboard";
  }
}
