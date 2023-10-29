import { pagingSchema } from "@/share/paging";
import { z } from "zod";

export type User = {
  id: string;
  name: string | null;
  image: string | null;
  profile: string | null;

  /**
   * ホーム画面のウェルカムメッセージが非表示か
   */
  welcomeMessageHidden: boolean;
};

const UserFields = {
  name: {
    maxLength: 50,
  },
  profile: { maxLength: 200 },
};
const { name, profile } = UserFields;

export const profileFormSchema = z.object({
  name: z
    .string()
    .min(1, "ユーザー名を入力してください。")
    .max(
      name.maxLength,
      `ユーザー名は${name.maxLength}文字以内で入力してください。`
    )
    .optional(),
  profile: z
    .string()
    .max(
      profile.maxLength,
      `自己紹介文は${profile.maxLength}文字以内で入力してください。`
    )
    .optional(),
  welcomeMessageHidden: z.boolean().optional(),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

const userDetailPageTabSchema = z.union([
  z.literal("postedIdeas"),
  z.literal("devs"),
  z.literal("likedIdeas"),
  z.literal("likedDevs"),
]);
export type UserDetailPageTab = z.infer<typeof userDetailPageTabSchema>;

/** ユーザー詳細画面用のスキーマ */
export const userDetailPageSchame = z.object({
  tab: userDetailPageTabSchema.default("postedIdeas"),
  page: pagingSchema.default(1),
});

/** ユーザー削除画面用のスキーマ */
export const userDeletePageSchema = z.object({ reCaptchaToken: z.string() });
