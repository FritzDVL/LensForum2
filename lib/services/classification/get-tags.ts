import { Tag } from "@/lib/domain/classification/types";
import { supabaseClient } from "@/lib/external/supabase/client";

export async function getTags(channelAddress: string): Promise<Tag[]> {
  const supabase = await supabaseClient();
  const { data, error } = await supabase.from("tags").select("*").eq("channel_address", channelAddress).order("name");

  if (error) {
    console.error("Error fetching tags:", error);
    return [];
  }

  return data as Tag[];
}
