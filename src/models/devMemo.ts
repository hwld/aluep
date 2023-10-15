import { z } from "zod";

export type DevMemo = {
  id: string;
  devId: string;
  text: string;
  fromUser: { id: string; name: string | null; imageUrl: string | null };
  parentMemoId: string | null;
  createdAt: Date;
};

const DevMemoFields = {
  text: { maxLength: 2000 },
};

const { text } = DevMemoFields;

export const devMemoFormSchema = z.object({
  text: z
    .string()
    .min(1, "メモを入力してください。")
    .max(text.maxLength, `メモは${text.maxLength}文字以下で入力してください。`),
});
export type DevMemoFormData = z.infer<typeof devMemoFormSchema>;
export const createDevMemoInputSchema = devMemoFormSchema.and(
  z.object({
    devId: z.string().min(1),
    parentMemoId: z.string().min(1).optional(),
  })
);
