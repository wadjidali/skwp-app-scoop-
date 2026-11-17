import { isSupabaseConfigured, supabase } from "./supabase";

/** Vérifie que l'app joint bien Supabase : doit trouver les 6 opportunités. */
export async function checkSupabase() {
  if (!isSupabaseConfigured) {
    console.warn("Supabase : variables .env manquantes (URL ou clé).");
    return;
  }
  const { count, error } = await supabase
    .from("opportunities")
    .select("id", { count: "exact", head: true });

  if (error) console.warn("Supabase : erreur de connexion →", error.message);
  else console.log(`Supabase OK : ${count} opportunités trouvées.`);
}
