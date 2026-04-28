export type Profile = {
  id: string;
  clerkUserId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
};

export type PostSummary = {
  id: string;
  rating: number;
  notes: string | null;
  photoUrl: string;
  createdAt: string;
  author: Pick<Profile, "username" | "displayName">;
};

export type PostDetail = PostSummary & {
  ingredients: string[];
  steps: string[];
};

export type CreatePostState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: {
    rating?: string[];
    notes?: string[];
    photo?: string[];
    ingredients?: string[];
    steps?: string[];
  };
};
