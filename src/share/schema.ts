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
  tags: z.array(z.string().min(1)).max(50),
});
export type ThemeFormData = z.infer<typeof themeFormSchema>;

// 更新するときにはidが必要なのでお題のフォームにそれを追加する
export const themeUpdateFormSchema = z
  .object({ themeId: z.string() })
  .and(themeFormSchema);

// プロフィールのフォームデータ
export const profileFormSchema = z.object({
  name: z
    .string()
    .min(1, "ユーザー名を入力してください。")
    .max(50, "ユーザー名は50文字以内で入力してください。"),
});
export type ProfileFormData = z.infer<typeof profileFormSchema>;
