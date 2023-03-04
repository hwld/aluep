import { Prisma } from "@prisma/client";
import { z } from "zod";
import { OmitStrict } from "../../types/OmitStrict";
import { db } from "../lib/prismadb";

const themeCommentSchema = z.object({
  id: z.string(),
  comment: z.string(),
  themeId: z.string(),
  fromUser: z.object({
    id: z.string(),
    name: z.string().nullable(),
    image: z.string().nullable(),
  }),

  /** nullのときは返信元が削除されていること、undefinedのときは返信コメントではないことを表す */
  inReplyToComment: z
    .object({ id: z.string(), fromUserName: z.string().nullable() })
    .nullable()
    .optional(),
  createdAt: z.date(),
});
// 返信元が存在しない -> undefined
// 返信元が削除された -> { isDeleted: true }
// 返信元が存在する -> { commentId:string, fromUserName:string }

export type ThemeComment = z.infer<typeof themeCommentSchema>;

const themeCommentArgs = {
  select: {
    id: true,
    comment: true,
    themeId: true,
    fromUser: true,
    createdAt: true,
    // このコメントがChildのParentChildアイテムを取得する
    asChild: {
      select: {
        parentCommentId: true,
        parentComment: { select: { fromUser: { select: { name: true } } } },
      },
    },
  },
} satisfies Prisma.AppThemeCommentArgs;

const buildInReplyToComment = (
  rawComment: Prisma.AppThemeCommentGetPayload<typeof themeCommentArgs>
): ThemeComment["inReplyToComment"] => {
  if (rawComment.asChild === null) {
    // asChildがないということは、誰の子供でもないということなので、返信コメントではないとしてundefinedを返す
    return undefined;
  } else if (rawComment.asChild.parentCommentId === null) {
    //　parentCommentIdがnullになるのは、返信元コメントが削除されているということ
    return null;
  } else {
    // それ以外の場合は返信元が存在するということなので返信元のコメントidと返信元コメントの投稿者を取得する
    return {
      id: rawComment.asChild.parentCommentId,
      fromUserName: rawComment.asChild.parentComment?.fromUser.name ?? null,
    };
  }
};

const convertThemeComment = (
  raw: Prisma.AppThemeCommentGetPayload<typeof themeCommentArgs>
): ThemeComment => {
  const comment: ThemeComment = {
    id: raw.id,
    comment: raw.comment,
    themeId: raw.themeId,
    fromUser: {
      id: raw.fromUser.id,
      name: raw.fromUser.name,
      image: raw.fromUser.image,
    },
    inReplyToComment: buildInReplyToComment(raw),
    createdAt: raw.createdAt,
  };
  return comment;
};

type FindManyThemeCommentsArgs = OmitStrict<
  Prisma.AppThemeCommentFindManyArgs,
  "include" | "select"
>;
export const findManyThemeComments = async ({
  orderBy,
  ...args
}: FindManyThemeCommentsArgs): Promise<ThemeComment[]> => {
  const rawComments = await db.appThemeComment.findMany({
    orderBy: { createdAt: "desc", ...orderBy },
    ...args,
    ...themeCommentArgs,
  });

  const comments = rawComments.map((raw) => {
    return convertThemeComment(raw);
  });

  return comments;
};
