import { supabase } from "./supabase";

export async function saveProfile(profile: {
  name?: string;
  height_cm: number;
  bust_in: number;
  waist_in: number;
  hips_in: number;
  body_shape?: string;
  seasonal_palette: string;
  style_preference?: string;
  session_id: string;
}) {
  return await supabase
    .from("profiles")
    .upsert(profile, {
      onConflict: "session_id",
    });
}

export async function loadProfile(session_id: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("session_id", session_id)
    .single();

  return { data, error };
}