import { z } from "zod";

export type IdeaComment = {
  /** nullのときは返信元が削除されている
   *  undefinedのときは返信コメントではない
   */
  inReplyToComment?:
    | {
        id: string;
        fromUserName: string | null;
      }
    | null
    | undefined;
  id: string;
  comment: string;
  ideaId: string;
  fromUser: {
    id: string;
    name: string | null;
    image: string | null;
  };
  createdAt: Date;
};

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
