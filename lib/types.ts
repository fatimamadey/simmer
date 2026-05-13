export type Profile = {
  id: string;
  clerkUserId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
};

export type ProfileStats = Profile & {
  postCount: number;
  avgRating: number;
  followerCount: number;
  followingCount: number;
};

export type PostSummary = {
  id: string;
  title: string;
  rating: number;
  notes: string | null;
  photoUrl: string;
  createdAt: string;
  author: Pick<Profile, "username" | "displayName">;
};

export type PostDetail = PostSummary & {
  authorProfileId: string;
  ingredients: string[];
  steps: string[];
};

export type Comment = {
  id: string;
  postId: string;
  body: string;
  createdAt: string;
  author: Pick<Profile, "username" | "displayName" | "avatarUrl">;
  authorProfileId: string;
};

export type CreatePostState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: {
    title?: string[];
    rating?: string[];
    notes?: string[];
    photo?: string[];
    ingredients?: string[];
    steps?: string[];
  };
};
