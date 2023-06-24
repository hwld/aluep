import { z } from "zod";

export const developmentMemoFormSchema = z.object({
  developmentId: z.string().min(1),
  memo: z
    .string()
    .min(1, "メモを入力してください。")
    .max(2000, "メモは2000文字以下で入力してください。"),
  parentMemoId: z.string().min(1).optional(),
});
export type DevelopmentMemoFormData = z.infer<typeof developmentMemoFormSchema>;
