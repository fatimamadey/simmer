"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { upsertProfile, getProfileByClerkUserId, getPostById } from "@/lib/data";
import { createSupabaseAdminClient } from "@/lib/supabase";
import type { CreatePostState } from "@/lib/types";
import { createPostSchema } from "@/lib/validation";

const initialState: CreatePostState = {
  status: "idle"
};

function parseRepeatedField(formData: FormData, fieldName: string) {
  return formData
    .getAll(fieldName)
    .map((value) => value.toString().trim())
    .filter(Boolean);
}

export async function createPostAction(
  _previousState: CreatePostState = initialState,
  formData: FormData
): Promise<CreatePostState> {
  const { userId } = await auth();

  if (!userId) {
    return { status: "error", message: "You need to sign in before posting." };
  }

  const photo = formData.get("photo");
  const parsed = createPostSchema.safeParse({
    title: formData.get("title")?.toString() ?? "",
    rating: formData.get("rating"),
    notes: formData.get("notes")?.toString() ?? "",
    ingredients: parseRepeatedField(formData, "ingredients"),
    steps: parseRepeatedField(formData, "steps")
  });

  if (!(photo instanceof File) || photo.size === 0) {
    return { status: "error", fieldErrors: { photo: ["Add one photo for the dish."] } };
  }

  if (!photo.type.startsWith("image/")) {
    return { status: "error", fieldErrors: { photo: ["The uploaded file must be an image."] } };
  }

  if (!parsed.success) {
    return { status: "error", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    return { status: "error", message: "Could not load your profile. Try signing in again." };
  }

  const supabase = createSupabaseAdminClient();
  const username =
    clerkUser.username ??
    clerkUser.primaryEmailAddress?.emailAddress.split("@")[0] ??
    `cook-${userId.slice(0, 8)}`;
  const displayName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null;

  const profileId = await upsertProfile({
    clerkUserId: userId,
    username,
    displayName,
    avatarUrl: clerkUser.imageUrl ?? null
  });

  const fileExt = photo.name.split(".").pop() || "jpg";
  const filePath = `${userId}/${crypto.randomUUID()}.${fileExt}`;
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
      profile_id: profileId,
      title: parsed.data.title,
      rating: parsed.data.rating,
      notes: parsed.data.notes || null,
      photo_url: publicUrlData.publicUrl
    })
    .select("id")
    .single();

  if (postError) {
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

  const photo = formData.get("photo");
  let photoUrl = post.photoUrl;

  if (photo instanceof File && photo.size > 0) {
    if (!photo.type.startsWith("image/")) {
      return { status: "error", fieldErrors: { photo: ["The uploaded file must be an image."] } };
    }
    const fileExt = photo.name.split(".").pop() || "jpg";
    const filePath = `${userId}/${crypto.randomUUID()}.${fileExt}`;
    const fileBuffer = Buffer.from(await photo.arrayBuffer());

    const { error: uploadError } = await supabase.storage.from("recipe-photos").upload(filePath, fileBuffer, {
      contentType: photo.type,
      upsert: false
    });
    if (uploadError) return { status: "error", message: `Photo upload failed: ${uploadError.message}` };

    const { data: publicUrlData } = supabase.storage.from("recipe-photos").getPublicUrl(filePath);
    photoUrl = publicUrlData.publicUrl;
  }

  const { error: postError } = await supabase
    .from("posts")
    .update({ title: parsed.data.title, rating: parsed.data.rating, notes: parsed.data.notes || null, photo_url: photoUrl })
    .eq("id", postId);

  if (postError) return { status: "error", message: `Could not update the post: ${postError.message}` };

  await Promise.all([
    supabase.from("post_ingredients").delete().eq("post_id", postId),
    supabase.from("post_steps").delete().eq("post_id", postId)
  ]);

  const ingredientRows = parsed.data.ingredients.map((content, index) => ({ post_id: postId, content, sort_order: index }));
  const stepRows = parsed.data.steps.map((content, index) => ({ post_id: postId, content, sort_order: index }));

  const [{ error: ingredientError }, { error: stepError }] = await Promise.all([
    supabase.from("post_ingredients").insert(ingredientRows),
    supabase.from("post_steps").insert(stepRows)
  ]);

  if (ingredientError || stepError) {
    return { status: "error", message: "Could not save the recipe details." };
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

  const storagePath = post.photoUrl.split("/recipe-photos/")[1];
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

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("follows")
    .upsert({ follower_id: profile.id, following_id: followingProfileId }, { onConflict: "follower_id,following_id" });

  if (error) throw new Error(`Failed to follow: ${error.message}`);

  revalidatePath("/feed");
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
