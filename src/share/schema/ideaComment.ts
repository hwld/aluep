import { z } from "zod";

export const ideaCommentFormSchema = z.object({
  comment: z
    .string()
    .min(1, "コメントを入力してください。")
    .max(2000, "コメントは2000文字以下で入力してください。"),
});
export type IdeaCommentFormData = z.infer<typeof ideaCommentFormSchema>;
export const createIdeaCommentInputSchema = ideaCommentFormSchema.and(
  z.object({
    ideaId: z.string().min(1),
    inReplyToCommentId: z.string().min(1).optional(),
  })
);
