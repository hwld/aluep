import { IdeaComment } from "@/models/ideaComment";
import { db } from "@/server/lib/prismadb";
import { OmitStrict } from "@/types/OmitStrict";
import { Prisma } from "@prisma/client";

const ideaCommentArgs = {
  select: {
    id: true,
    text: true,
    ideaId: true,
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
} satisfies Prisma.IdeaCommentArgs;

const buildInReplyToComment = (
  rawComment: Prisma.IdeaCommentGetPayload<typeof ideaCommentArgs>
): IdeaComment["inReplyToComment"] => {
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

const convertIdeaComment = (
  raw: Prisma.IdeaCommentGetPayload<typeof ideaCommentArgs>
): IdeaComment => {
  const comment: IdeaComment = {
    id: raw.id,
    text: raw.text,
    ideaId: raw.ideaId,
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

type FindManyIdeaCommentsArgs = OmitStrict<
  Prisma.IdeaCommentFindManyArgs,
  "include" | "select" | "orderBy"
>;
export const findManyIdeaComments = async (
  args: FindManyIdeaCommentsArgs
): Promise<IdeaComment[]> => {
  const rawComments = await db.ideaComment.findMany({
    orderBy: { createdAt: "asc" },
    ...args,
    ...ideaCommentArgs,
  });

  const comments = rawComments.map((raw) => {
    return convertIdeaComment(raw);
  });

  return comments;
};
