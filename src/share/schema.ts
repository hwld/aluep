import { z } from "zod";

// お題のフォームデータ
export const themeFormSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルを入力してください。")
    .max(50, "タイトルは50文字以下で入力してください。"),
  description: z
    .string()
    .min(1, "説明を入力してください。")
    .max(5000, "説明は5000文字以下で入力してください。"),
  tags: z
    .array(z.string().min(1).max(100))
    .max(50, "タグは最大50個までしかつけることができません。"),
});
export type ThemeFormData = z.infer<typeof themeFormSchema>;

// 更新するときにはidが必要なのでお題のフォームにそれを追加する
export const themeUpdateFormSchema = z
  .object({ themeId: z.string().min(1).max(100) })
  .and(themeFormSchema);
export type ThemeJoinFormData = z.infer<typeof themeJoinFormSchema>;

export const themeJoinFormSchema = z.object({
  themeId: z.string().min(1).max(100),
  githubUrl: z
    .string()
    .min(1, "リポジトリ名を入力してください。")
    .max(120, "リポジトリ名は120文字以下で入力してください。")
    .regex(
      /^https:\/\/github.com\/[^\/]+\/[^\/\?&]+$/,
      "https://から始まる有効なGitHubリポジトリのURLを入力してください。"
    ),
  comment: z
    .string()
    .max(300, "コメントは300文字以下で入力してください。")
    .optional(),
});

// プロフィールのフォームデータ
export const profileFormSchema = z.object({
  name: z
    .string()
    .min(1, "ユーザー名を入力してください。")
    .max(50, "ユーザー名は50文字以内で入力してください。"),
  profile: z.string().max(200, "自己紹介文は200文字以内で入力してください。"),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

export const pageSchema = z
  .string()
  .optional()
  .transform((page) => {
    const p = Number(page);
    if (isNaN(p)) {
      return 1;
    }
    return p;
  });
