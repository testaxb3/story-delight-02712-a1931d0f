export interface Routine {
  id: string;
  user_id: string;
  child_profile_id?: string;
  title: string;
  icon: string;
  color: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  steps?: RoutineStep[];
}

export interface RoutineStep {
  id: string;
  routine_id: string;
  title: string;
  icon: string;
  duration_seconds: number;
  position: number;
  created_at: string;
}

export interface RoutineCompletion {
  id: string;
  routine_id: string;
  user_id: string;
  child_profile_id?: string;
  completed_at: string;
  mood_before?: 'happy' | 'neutral' | 'sad' | 'frustrated';
  mood_after?: 'happy' | 'neutral' | 'sad' | 'frustrated';
  duration_seconds?: number;
  steps_completed: number;
}

export interface RoutineTemplate {
  id: string;
  title: string;
  description?: string;
  brain_profile: 'INTENSE' | 'DISTRACTED' | 'DEFIANT' | 'UNIVERSAL';
  icon: string;
  color: string;
  template_steps: Array<{
    title: string;
    icon: string;
    duration: number;
  }>;
  created_at: string;
}
