import { z } from "zod";

export const themeCreateInputSchema = z.object({
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
export type ThemeCreateInput = z.infer<typeof themeCreateInputSchema>;

export const themeUpdateInputSchema = z
  .object({ themeId: z.string() })
  .and(themeCreateInputSchema);
