import { z } from "zod";

// TODO: DevMemoとかにする
export type DevelopmentMemo = {
  id: string;
  developmentId: string;
  text: string;
  fromUser: { id: string; name: string | null; imageUrl: string | null };
  parentMemoId: string | null;
  createdAt: Date;
};

export const DevelopmentMemoFields = {
  text: { maxLength: 2000 },
};

const { text } = DevelopmentMemoFields;

export const developmentMemoFormSchema = z.object({
  text: z
    .string()
    .min(1, "メモを入力してください。")
    .max(text.maxLength, `メモは${text.maxLength}文字以下で入力してください。`),
});
export type DevelopmentMemoFormData = z.infer<typeof developmentMemoFormSchema>;
export const createDevelopmentMemoInputSchema = developmentMemoFormSchema.and(
  z.object({
    developmentId: z.string().min(1),
    parentMemoId: z.string().min(1).optional(),
  })
);
