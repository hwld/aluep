import { Prisma } from "@prisma/client";
import { OmitStrict } from "../../types/OmitStrict";
import { db } from "../lib/prismadb";

export type ThemeComment = {
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
  themeId: string;
  fromUser: {
    id: string;
    name: string | null;
    image: string | null;
  };
  createdAt: Date;
};

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
