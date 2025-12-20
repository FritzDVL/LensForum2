import { Category } from "@/lib/domain/classification/types";
import { supabaseClient } from "@/lib/external/supabase/client";

export async function getCategories(channelAddress: string): Promise<Category[]> {
  const supabase = await supabaseClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .ilike("channel_address", channelAddress)
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data as Category[];
}
