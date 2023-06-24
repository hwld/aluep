import { z } from "zod";

export const developmentMemoFormSchema = z.object({
  memo: z
    .string()
    .min(1, "メモを入力してください。")
    .max(2000, "メモは2000文字以下で入力してください。"),
});
export type DevelopmentMemoFormData = z.infer<typeof developmentMemoFormSchema>;
export const createDevelopmentMemoInputSchema = developmentMemoFormSchema.and(
  z.object({
    developmentId: z.string().min(1),
    parentMemoId: z.string().min(1).optional(),
  })
);
