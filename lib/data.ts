import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase";
import type { PostDetail, PostSummary, Profile } from "@/lib/types";

type PostRow = {
  id: string;
  rating: number;
  notes: string | null;
  photo_url: string;
  created_at: string;
  profiles: Array<{
    username: string;
    display_name: string | null;
  }> | null;
};

export async function getFeedPosts(): Promise<PostSummary[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, rating, notes, photo_url, created_at, profiles(username, display_name)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load feed: ${error.message}`);
  }

  return ((data ?? []) as PostRow[]).map((row) => ({
    id: row.id,
    rating: row.rating,
    notes: row.notes,
    photoUrl: row.photo_url,
    createdAt: row.created_at,
    author: {
      username: row.profiles?.[0]?.username ?? "cook",
      displayName: row.profiles?.[0]?.display_name ?? null
    }
  }));
}

export async function getPostById(postId: string): Promise<PostDetail | null> {
  const supabase = createSupabaseAdminClient();
  const { data: post, error } = await supabase
    .from("posts")
    .select("id, rating, notes, photo_url, created_at, profiles(username, display_name)")
    .eq("id", postId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load post: ${error.message}`);
  }

  if (!post) {
    return null;
  }

  const [{ data: ingredients, error: ingredientError }, { data: steps, error: stepError }] = await Promise.all([
    supabase.from("post_ingredients").select("content, sort_order").eq("post_id", postId).order("sort_order", { ascending: true }),
    supabase.from("post_steps").select("content, sort_order").eq("post_id", postId).order("sort_order", { ascending: true })
  ]);

  if (ingredientError) {
    throw new Error(`Failed to load ingredients: ${ingredientError.message}`);
  }

  if (stepError) {
    throw new Error(`Failed to load steps: ${stepError.message}`);
  }

  const typedPost = post as PostRow;

  return {
    id: typedPost.id,
    rating: typedPost.rating,
    notes: typedPost.notes,
    photoUrl: typedPost.photo_url,
    createdAt: typedPost.created_at,
    author: {
      username: typedPost.profiles?.[0]?.username ?? "cook",
      displayName: typedPost.profiles?.[0]?.display_name ?? null
    },
    ingredients: (ingredients ?? []).map((item) => item.content),
    steps: (steps ?? []).map((item) => item.content)
  };
}

export async function upsertProfile(profile: Omit<Profile, "id">) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
    {
      clerk_user_id: profile.clerkUserId,
      username: profile.username,
      display_name: profile.displayName,
      avatar_url: profile.avatarUrl
    },
    { onConflict: "clerk_user_id" }
    )
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to upsert profile: ${error.message}`);
  }

  return data.id as string;
}
