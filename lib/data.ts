import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase";
import type { Comment, PostDetail, PostSummary, Profile, ProfileStats } from "@/lib/types";

type PostRow = {
  id: string;
  profile_id: string;
  title: string;
  rating: number;
  notes: string | null;
  photo_url: string;
  created_at: string;
  author_profile:
    | {
        username: string;
        display_name: string | null;
      }
    | Array<{
        username: string;
        display_name: string | null;
      }>
    | null;
};

function rowToPostSummary(row: PostRow): PostSummary {
  const authorProfile = Array.isArray(row.author_profile) ? row.author_profile[0] : row.author_profile;

  return {
    id: row.id,
    title: row.title,
    rating: row.rating,
    notes: row.notes,
    photoUrl: row.photo_url,
    createdAt: row.created_at,
    author: {
      username: authorProfile?.username ?? "cook",
      displayName: authorProfile?.display_name ?? null
    }
  };
}

const POST_SELECT =
  "id, profile_id, title, rating, notes, photo_url, created_at, author_profile:profiles!posts_profile_id_fkey(username, display_name)";

function sanitizeSearchTerm(query: string) {
  return query
    .slice(0, 50)
    .replace(/[^a-zA-Z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const FEED_PAGE_SIZE = 12;

export async function getFeedPosts(limit = FEED_PAGE_SIZE): Promise<{ posts: PostSummary[]; hasMore: boolean }> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .order("created_at", { ascending: false })
    .limit(limit + 1);

  if (error) throw new Error(`Failed to load feed: ${error.message}`);

  const rows = (data ?? []) as PostRow[];
  return { posts: rows.slice(0, limit).map(rowToPostSummary), hasMore: rows.length > limit };
}

export async function getFeedPostsForUser(profileId: string, limit = FEED_PAGE_SIZE): Promise<{ posts: PostSummary[]; hasMore: boolean }> {
  const supabase = createSupabaseAdminClient();

  const { data: followRows, error: followError } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", profileId);

  if (followError) throw new Error(`Failed to load follows: ${followError.message}`);

  const followingIds = (followRows ?? []).map((r) => r.following_id);
  if (followingIds.length === 0) return { posts: [], hasMore: false };

  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .in("profile_id", followingIds)
    .order("created_at", { ascending: false })
    .limit(limit + 1);

  if (error) throw new Error(`Failed to load following feed: ${error.message}`);

  const rows = (data ?? []) as PostRow[];
  return { posts: rows.slice(0, limit).map(rowToPostSummary), hasMore: rows.length > limit };
}

export async function getSavedPostIds(profileId: string, postIds: string[]): Promise<Set<string>> {
  if (postIds.length === 0) return new Set();

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("saved_posts")
    .select("post_id")
    .eq("profile_id", profileId)
    .in("post_id", postIds);

  if (error) throw new Error(`Failed to load saved posts: ${error.message}`);

  return new Set((data ?? []).map((row) => row.post_id as string));
}

export async function isPostSaved(profileId: string, postId: string): Promise<boolean> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("saved_posts")
    .select("post_id")
    .eq("profile_id", profileId)
    .eq("post_id", postId)
    .maybeSingle();

  if (error) throw new Error(`Failed to check saved post: ${error.message}`);
  return data !== null;
}

export async function getSavedPostsForUser(profileId: string): Promise<PostSummary[]> {
  const supabase = createSupabaseAdminClient();
  const { data: savedRows, error: savedError } = await supabase
    .from("saved_posts")
    .select("post_id")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false });

  if (savedError) throw new Error(`Failed to load saved posts: ${savedError.message}`);

  const postIds = (savedRows ?? []).map((row) => row.post_id as string);
  if (postIds.length === 0) return [];

  const { data, error } = await supabase.from("posts").select(POST_SELECT).in("id", postIds);

  if (error) throw new Error(`Failed to load saved recipes: ${error.message}`);

  const postsById = new Map(((data ?? []) as PostRow[]).map((row) => [row.id, rowToPostSummary(row)]));
  return postIds.map((postId) => postsById.get(postId)).filter((post): post is PostSummary => Boolean(post));
}

export async function getPostById(postId: string): Promise<PostDetail | null> {
  const supabase = createSupabaseAdminClient();
  const { data: post, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("id", postId)
    .maybeSingle();

  if (error) throw new Error(`Failed to load post: ${error.message}`);
  if (!post) return null;

  const [{ data: ingredients, error: ingredientError }, { data: steps, error: stepError }] = await Promise.all([
    supabase.from("post_ingredients").select("content, sort_order").eq("post_id", postId).order("sort_order", { ascending: true }),
    supabase.from("post_steps").select("content, sort_order").eq("post_id", postId).order("sort_order", { ascending: true })
  ]);

  if (ingredientError) throw new Error(`Failed to load ingredients: ${ingredientError.message}`);
  if (stepError) throw new Error(`Failed to load steps: ${stepError.message}`);

  const typedPost = post as PostRow;

  return {
    ...rowToPostSummary(typedPost),
    authorProfileId: typedPost.profile_id,
    ingredients: (ingredients ?? []).map((item) => item.content),
    steps: (steps ?? []).map((item) => item.content)
  };
}

export async function getPostsByProfileId(profileId: string): Promise<PostSummary[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to load profile posts: ${error.message}`);

  return ((data ?? []) as PostRow[]).map(rowToPostSummary);
}

export async function getProfileByUsername(username: string): Promise<ProfileStats | null> {
  const supabase = createSupabaseAdminClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, clerk_user_id, username, display_name, avatar_url")
    .eq("username", username)
    .maybeSingle();

  if (error) throw new Error(`Failed to load profile: ${error.message}`);
  if (!profile) return null;

  const [
    { data: postStats, error: postStatsError },
    { count: followerCount, error: followerError },
    { count: followingCount, error: followingError }
  ] = await Promise.all([
    supabase.from("posts").select("rating").eq("profile_id", profile.id),
    supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", profile.id),
    supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", profile.id)
  ]);

  if (postStatsError) throw new Error(`Failed to load post stats: ${postStatsError.message}`);
  if (followerError) throw new Error(`Failed to load follower count: ${followerError.message}`);
  if (followingError) throw new Error(`Failed to load following count: ${followingError.message}`);

  const ratings = (postStats ?? []).map((p) => p.rating);
  const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

  return {
    id: profile.id,
    clerkUserId: profile.clerk_user_id,
    username: profile.username,
    displayName: profile.display_name,
    avatarUrl: profile.avatar_url,
    postCount: ratings.length,
    avgRating,
    followerCount: followerCount ?? 0,
    followingCount: followingCount ?? 0
  };
}

export async function getProfileByClerkUserId(clerkUserId: string): Promise<Profile | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, clerk_user_id, username, display_name, avatar_url")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();

  if (error) throw new Error(`Failed to load profile: ${error.message}`);
  if (!data) return null;

  return {
    id: data.id,
    clerkUserId: data.clerk_user_id,
    username: data.username,
    displayName: data.display_name,
    avatarUrl: data.avatar_url
  };
}

export async function isFollowing(followerProfileId: string, followingProfileId: string): Promise<boolean> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("follower_id", followerProfileId)
    .eq("following_id", followingProfileId)
    .maybeSingle();

  if (error) throw new Error(`Failed to check follow status: ${error.message}`);
  return data !== null;
}

export async function searchProfiles(query: string): Promise<Profile[]> {
  const supabase = createSupabaseAdminClient();
  const safe = sanitizeSearchTerm(query);
  if (!safe) return [];

  const { data, error } = await supabase
    .from("profiles")
    .select("id, clerk_user_id, username, display_name, avatar_url")
    .or(`username.ilike.%${safe}%,display_name.ilike.%${safe}%`)
    .order("username")
    .limit(20);

  if (error) throw new Error(`Failed to search profiles: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: row.id,
    clerkUserId: row.clerk_user_id,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url
  }));
}

export async function searchPosts(query: string): Promise<PostSummary[]> {
  const supabase = createSupabaseAdminClient();
  const safe = sanitizeSearchTerm(query);
  if (!safe) return [];

  const [
    { data: directMatches, error: directError },
    { data: ingredientMatches, error: ingredientError }
  ] = await Promise.all([
    supabase
      .from("posts")
      .select(POST_SELECT)
      .or(`title.ilike.%${safe}%,notes.ilike.%${safe}%`)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("post_ingredients")
      .select("post_id")
      .ilike("content", `%${safe}%`)
      .limit(20)
  ]);

  if (directError) throw new Error(`Failed to search recipes: ${directError.message}`);
  if (ingredientError) throw new Error(`Failed to search ingredients: ${ingredientError.message}`);

  const ingredientPostIds = Array.from(new Set((ingredientMatches ?? []).map((row) => row.post_id as string)));
  const directRows = (directMatches ?? []) as PostRow[];

  if (ingredientPostIds.length === 0) return directRows.map(rowToPostSummary);

  const seen = new Set(directRows.map((row) => row.id));
  const missingIngredientPostIds = ingredientPostIds.filter((postId) => !seen.has(postId));

  if (missingIngredientPostIds.length === 0) return directRows.map(rowToPostSummary);

  const { data: ingredientPosts, error: ingredientPostError } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .in("id", missingIngredientPostIds)
    .order("created_at", { ascending: false });

  if (ingredientPostError) throw new Error(`Failed to load ingredient matches: ${ingredientPostError.message}`);

  return [...directRows, ...((ingredientPosts ?? []) as PostRow[])].slice(0, 20).map(rowToPostSummary);
}

export async function ensureProfile(
  clerkUserId: string,
  clerkData: {
    username: string | null;
    firstName: string | null;
    lastName: string | null;
    imageUrl: string;
    emailAddress: string | null;
  }
): Promise<void> {
  const supabase = createSupabaseAdminClient();

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();

  if (existing) return;

  const normalizedBaseUsername = (
    clerkData.username ??
    clerkData.emailAddress?.split("@")[0] ??
    `cook_${clerkUserId.slice(-8)}`
  )
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .slice(0, 25);
  const fallbackUsername = `cook_${clerkUserId.slice(-8).replace(/[^a-z0-9_]/gi, "_").toLowerCase()}`;
  const baseUsername = normalizedBaseUsername.length >= 2 ? normalizedBaseUsername : fallbackUsername;

  const displayName =
    [clerkData.firstName, clerkData.lastName].filter(Boolean).join(" ") || null;

  let username = baseUsername;
  for (let attempt = 0; attempt < 5; attempt++) {
    const { error } = await supabase.from("profiles").insert({
      clerk_user_id: clerkUserId,
      username,
      display_name: displayName,
      avatar_url: clerkData.imageUrl || null,
    });

    if (!error) return;
    if (error.code === "23505" && error.message.includes("clerk_user_id")) return;
    if (error.code === "23505") {
      username = `${baseUsername.slice(0, 20)}_${Math.floor(Math.random() * 9000) + 1000}`;
      continue;
    }
    throw new Error(`Failed to create profile: ${error.message}`);
  }
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

  if (error) throw new Error(`Failed to upsert profile: ${error.message}`);

  return data.id as string;
}

export async function getCommentsForPost(postId: string): Promise<Comment[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("comments")
    .select("id, post_id, profile_id, body, created_at, author:profiles!comments_profile_id_fkey(username, display_name, avatar_url)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Failed to load comments: ${error.message}`);

  return (data ?? []).map((row) => {
    const author = Array.isArray(row.author) ? row.author[0] : row.author;
    return {
      id: row.id,
      postId: row.post_id,
      body: row.body,
      createdAt: row.created_at,
      authorProfileId: row.profile_id,
      author: {
        username: author?.username ?? "cook",
        displayName: author?.display_name ?? null,
        avatarUrl: author?.avatar_url ?? null
      }
    };
  });
}
