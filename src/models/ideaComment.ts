import { z } from "zod";

export type IdeaComment = {
  // TODO: parentCommentのほうがわかりやすい気がする
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
  text: string;
  ideaId: string;
  fromUser: {
    id: string;
    name: string | null;
    image: string | null;
  };
  createdAt: Date;
};

const IdeaCommentFields = {
  text: {
    maxLength: 2000,
  },
};
const { text } = IdeaCommentFields;

export const ideaCommentFormSchema = z.object({
  text: z
    .string()
    .min(1, "コメントを入力してください。")
    .max(
      text.maxLength,
      `コメントは${text.maxLength}文字以下で入力してください。`
    ),
});
export type IdeaCommentFormData = z.infer<typeof ideaCommentFormSchema>;
export const createIdeaCommentInputSchema = ideaCommentFormSchema.and(
  z.object({
    ideaId: z.string().min(1),
    inReplyToCommentId: z.string().min(1).optional(),
  })
);
