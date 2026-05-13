"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ensureProfile, getProfileByClerkUserId, getPostById } from "@/lib/data";
import { createSupabaseAdminClient } from "@/lib/supabase";
import type { CreatePostState } from "@/lib/types";
import { ALLOWED_PHOTO_TYPES, MAX_PHOTO_SIZE_BYTES, createPostSchema } from "@/lib/validation";

const initialState: CreatePostState = {
  status: "idle"
};

function parseRepeatedField(formData: FormData, fieldName: string) {
  return formData
    .getAll(fieldName)
    .map((value) => value.toString().trim())
    .filter(Boolean);
}

const photoExtensions: Record<(typeof ALLOWED_PHOTO_TYPES)[number], string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp"
};

function formatFileSize(bytes: number) {
  return `${Math.round(bytes / 1024 / 1024)}MB`;
}

function validatePhoto(photo: FormDataEntryValue | null, required: boolean) {
  if (!(photo instanceof File) || photo.size === 0) {
    return required
      ? { error: "Add one photo for the dish." }
      : { file: null };
  }

  if (!ALLOWED_PHOTO_TYPES.includes(photo.type as (typeof ALLOWED_PHOTO_TYPES)[number])) {
    return { error: "Upload a JPG, PNG, or WebP image." };
  }

  if (photo.size > MAX_PHOTO_SIZE_BYTES) {
    return { error: `Keep photos under ${formatFileSize(MAX_PHOTO_SIZE_BYTES)}.` };
  }

  return { file: photo };
}

function storagePathForPhoto(userId: string, photo: File) {
  const fileExt = photoExtensions[photo.type as (typeof ALLOWED_PHOTO_TYPES)[number]];
  return `${userId}/${crypto.randomUUID()}.${fileExt}`;
}

function storagePathFromPublicUrl(photoUrl: string) {
  const marker = "/recipe-photos/";
  const path = photoUrl.split(marker)[1]?.split("?")[0];
  return path ? decodeURIComponent(path) : null;
}

export async function createPostAction(
  _previousState: CreatePostState = initialState,
  formData: FormData
): Promise<CreatePostState> {
  const { userId } = await auth();

  if (!userId) {
    return { status: "error", message: "You need to sign in before posting." };
  }

  const photoResult = validatePhoto(formData.get("photo"), true);
  const parsed = createPostSchema.safeParse({
    title: formData.get("title")?.toString() ?? "",
    rating: formData.get("rating"),
    notes: formData.get("notes")?.toString() ?? "",
    ingredients: parseRepeatedField(formData, "ingredients"),
    steps: parseRepeatedField(formData, "steps")
  });

  if (photoResult.error) {
    return { status: "error", fieldErrors: { photo: [photoResult.error] } };
  }

  if (!parsed.success) {
    return { status: "error", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    return { status: "error", message: "Could not load your profile. Try signing in again." };
  }

  await ensureProfile(userId, {
    username: clerkUser.username ?? null,
    firstName: clerkUser.firstName ?? null,
    lastName: clerkUser.lastName ?? null,
    imageUrl: clerkUser.imageUrl,
    emailAddress: clerkUser.primaryEmailAddress?.emailAddress ?? null
  });

  const profile = await getProfileByClerkUserId(userId);

  if (!profile) {
    return { status: "error", message: "Could not load your profile. Try signing in again." };
  }

  const supabase = createSupabaseAdminClient();
  const photo = photoResult.file;
  if (!photo) {
    return { status: "error", fieldErrors: { photo: ["Add one photo for the dish."] } };
  }

  const filePath = storagePathForPhoto(userId, photo);
  const fileBuffer = Buffer.from(await photo.arrayBuffer());

  const { error: uploadError } = await supabase.storage.from("recipe-photos").upload(filePath, fileBuffer, {
    contentType: photo.type,
    upsert: false
  });

  if (uploadError) {
    return { status: "error", message: `Photo upload failed: ${uploadError.message}` };
  }

  const { data: publicUrlData } = supabase.storage.from("recipe-photos").getPublicUrl(filePath);

  const { data: postRow, error: postError } = await supabase
    .from("posts")
    .insert({
      profile_id: profile.id,
      title: parsed.data.title,
      rating: parsed.data.rating,
      notes: parsed.data.notes || null,
      photo_url: publicUrlData.publicUrl
    })
    .select("id")
    .single();

  if (postError) {
    await supabase.storage.from("recipe-photos").remove([filePath]);
    return { status: "error", message: `Could not save the recipe post: ${postError.message}` };
  }

  const ingredientRows = parsed.data.ingredients.map((content, index) => ({
    post_id: postRow.id,
    content,
    sort_order: index
  }));
  const stepRows = parsed.data.steps.map((content, index) => ({
    post_id: postRow.id,
    content,
    sort_order: index
  }));

  const [{ error: ingredientError }, { error: stepError }] = await Promise.all([
    supabase.from("post_ingredients").insert(ingredientRows),
    supabase.from("post_steps").insert(stepRows)
  ]);

  if (ingredientError || stepError) {
    await Promise.all([
      supabase.from("posts").delete().eq("id", postRow.id),
      supabase.storage.from("recipe-photos").remove([filePath])
    ]);

    return {
      status: "error",
      message: ingredientError?.message || stepError?.message || "Could not save the recipe details."
    };
  }

  revalidatePath("/");
  revalidatePath(`/posts/${postRow.id}`);
  redirect(`/posts/${postRow.id}`);
}

export async function updatePostAction(
  postId: string,
  _previousState: CreatePostState,
  formData: FormData
): Promise<CreatePostState> {
  const { userId } = await auth();
  if (!userId) return { status: "error", message: "You need to sign in." };

  const profile = await getProfileByClerkUserId(userId);
  if (!profile) return { status: "error", message: "Profile not found." };

  const post = await getPostById(postId);
  if (!post) return { status: "error", message: "Post not found." };
  if (post.authorProfileId !== profile.id) return { status: "error", message: "You can only edit your own posts." };

  const parsed = createPostSchema.safeParse({
    title: formData.get("title")?.toString() ?? "",
    rating: formData.get("rating"),
    notes: formData.get("notes")?.toString() ?? "",
    ingredients: parseRepeatedField(formData, "ingredients"),
    steps: parseRepeatedField(formData, "steps")
  });

  if (!parsed.success) return { status: "error", fieldErrors: parsed.error.flatten().fieldErrors };

  const supabase = createSupabaseAdminClient();

  const photoResult = validatePhoto(formData.get("photo"), false);
  if (photoResult.error) {
    return { status: "error", fieldErrors: { photo: [photoResult.error] } };
  }

  let photoUrl = post.photoUrl;
  let newStoragePath: string | null = null;

  if (photoResult.file) {
    const photo = photoResult.file;
    const filePath = storagePathForPhoto(userId, photo);
    const fileBuffer = Buffer.from(await photo.arrayBuffer());

    const { error: uploadError } = await supabase.storage.from("recipe-photos").upload(filePath, fileBuffer, {
      contentType: photo.type,
      upsert: false
    });
    if (uploadError) return { status: "error", message: `Photo upload failed: ${uploadError.message}` };

    const { data: publicUrlData } = supabase.storage.from("recipe-photos").getPublicUrl(filePath);
    photoUrl = publicUrlData.publicUrl;
    newStoragePath = filePath;
  }

  const { error: postError } = await supabase
    .from("posts")
    .update({ title: parsed.data.title, rating: parsed.data.rating, notes: parsed.data.notes || null, photo_url: photoUrl })
    .eq("id", postId);

  if (postError) {
    if (newStoragePath) {
      await supabase.storage.from("recipe-photos").remove([newStoragePath]);
    }
    return { status: "error", message: `Could not update the post: ${postError.message}` };
  }

  const [{ error: deleteIngredientsError }, { error: deleteStepsError }] = await Promise.all([
    supabase.from("post_ingredients").delete().eq("post_id", postId),
    supabase.from("post_steps").delete().eq("post_id", postId)
  ]);

  if (deleteIngredientsError || deleteStepsError) {
    return { status: "error", message: "Could not replace the recipe details." };
  }

  const ingredientRows = parsed.data.ingredients.map((content, index) => ({ post_id: postId, content, sort_order: index }));
  const stepRows = parsed.data.steps.map((content, index) => ({ post_id: postId, content, sort_order: index }));

  const [{ error: ingredientError }, { error: stepError }] = await Promise.all([
    supabase.from("post_ingredients").insert(ingredientRows),
    supabase.from("post_steps").insert(stepRows)
  ]);

  if (ingredientError || stepError) {
    return { status: "error", message: "Could not save the recipe details." };
  }

  if (newStoragePath) {
    const oldStoragePath = storagePathFromPublicUrl(post.photoUrl);
    if (oldStoragePath) {
      await supabase.storage.from("recipe-photos").remove([oldStoragePath]);
    }
  }

  revalidatePath("/");
  revalidatePath(`/posts/${postId}`);
  redirect(`/posts/${postId}`);
}

export async function deletePostAction(postId: string): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Not signed in.");

  const profile = await getProfileByClerkUserId(userId);
  if (!profile) throw new Error("Profile not found.");

  const post = await getPostById(postId);
  if (!post) throw new Error("Post not found.");
  if (post.authorProfileId !== profile.id) throw new Error("You can only delete your own posts.");

  const supabase = createSupabaseAdminClient();

  const storagePath = storagePathFromPublicUrl(post.photoUrl);
  if (storagePath) {
    await supabase.storage.from("recipe-photos").remove([storagePath]);
  }

  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) throw new Error(`Failed to delete post: ${error.message}`);

  revalidatePath("/");
  revalidatePath(`/profile/${post.author.username}`);
  redirect(`/profile/${post.author.username}`);
}

export async function followAction(followingProfileId: string): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Not signed in.");

  const profile = await getProfileByClerkUserId(userId);
  if (!profile) throw new Error("Profile not found.");
  if (followingProfileId === profile.id) throw new Error("You cannot follow yourself.");

  const supabase = createSupabaseAdminClient();
  const { data: targetProfile, error: targetError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", followingProfileId)
    .maybeSingle();

  if (targetError) throw new Error(`Failed to load profile: ${targetError.message}`);
  if (!targetProfile) throw new Error("Profile not found.");

  const { error } = await supabase
    .from("follows")
    .upsert({ follower_id: profile.id, following_id: followingProfileId }, { onConflict: "follower_id,following_id" });

  if (error) throw new Error(`Failed to follow: ${error.message}`);

  revalidatePath("/feed");
}

export async function savePostAction(postId: string): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Not signed in.");

  const profile = await getProfileByClerkUserId(userId);
  if (!profile) throw new Error("Profile not found.");

  const supabase = createSupabaseAdminClient();
  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("id")
    .eq("id", postId)
    .maybeSingle();

  if (postError) throw new Error(`Failed to load post: ${postError.message}`);
  if (!post) throw new Error("Post not found.");

  const { error } = await supabase
    .from("saved_posts")
    .upsert({ profile_id: profile.id, post_id: postId }, { onConflict: "profile_id,post_id" });

  if (error) throw new Error(`Failed to save recipe: ${error.message}`);

  revalidatePath("/saved");
  revalidatePath("/feed");
  revalidatePath(`/posts/${postId}`);
}

export async function unsavePostAction(postId: string): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Not signed in.");

  const profile = await getProfileByClerkUserId(userId);
  if (!profile) throw new Error("Profile not found.");

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("saved_posts")
    .delete()
    .eq("profile_id", profile.id)
    .eq("post_id", postId);

  if (error) throw new Error(`Failed to unsave recipe: ${error.message}`);

  revalidatePath("/saved");
  revalidatePath("/feed");
  revalidatePath(`/posts/${postId}`);
}

export async function unfollowAction(followingProfileId: string): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Not signed in.");

  const profile = await getProfileByClerkUserId(userId);
  if (!profile) throw new Error("Profile not found.");

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", profile.id)
    .eq("following_id", followingProfileId);

  if (error) throw new Error(`Failed to unfollow: ${error.message}`);

  revalidatePath("/feed");
}
