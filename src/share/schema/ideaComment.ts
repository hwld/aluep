import { z } from "zod";

export const ideaCommentFormSchema = z.object({
  ideaId: z.string().min(1),
  comment: z
    .string()
    .min(1, "コメントを入力してください。")
    .max(2000, "コメントは2000文字以下で入力してください。"),
  inReplyToCommentId: z.string().min(1).optional(),
});
export type IdeaCommentFormData = z.infer<typeof ideaCommentFormSchema>;
