import { pagingSchema } from "@/share/paging";
import { z } from "zod";

export type User = {
  id: string;
  name: string | null;
  image: string | null;
  profile: string | null;
};

export const profileFormSchema = z.object({
  name: z
    .string()
    .min(1, "ユーザー名を入力してください。")
    .max(50, "ユーザー名は50文字以内で入力してください。"),
  profile: z.string().max(200, "自己紹介文は200文字以内で入力してください。"),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

const userDetailPageTabSchema = z.union([
  z.literal("postedIdeas"),
  z.literal("developments"),
  z.literal("likedIdeas"),
  z.literal("likedDevelopments"),
]);
export type UserDetailPageTab = z.infer<typeof userDetailPageTabSchema>;

/** ユーザー詳細画面用のスキーマ */
export const userDetailPageSchame = z.object({
  tab: userDetailPageTabSchema.default("postedIdeas"),
  page: pagingSchema.default(1),
});
