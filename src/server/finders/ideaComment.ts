import { IdeaComment } from "@/models/ideaComment";
import { DbArgs, DbPayload, __new_db__ } from "@/server/lib/db";

type FindManyArgs = DbArgs<"ideaComments", "findMany">;
const ideaCommentArgs = {
  with: {
    fromUser: true,
    asChild: { with: { parentComment: { with: { fromUser: true } } } },
  },
} satisfies FindManyArgs;

type Payload = DbPayload<
  typeof __new_db__.query.ideaComments.findFirst<typeof ideaCommentArgs>
>;

const buildInReplyToComment = (
  rawComment: Payload
): IdeaComment["inReplyToComment"] => {
  // TODO: 自己参照テーブルでよくない？
  const asChild =
    rawComment.asChild.length === 0 ? null : rawComment.asChild[0];

  if (asChild === null) {
    // asChildがないということは、誰の子供でもないということなので、返信コメントではないとしてundefinedを返す
    return undefined;
  } else if (asChild.parentCommentId === null) {
    //　parentCommentIdがnullになるのは、返信元コメントが削除されているということ
    return null;
  } else {
    // それ以外の場合は返信元が存在するということなので返信元のコメントidと返信元コメントの投稿者を取得する
    return {
      id: asChild.parentCommentId,
      fromUserName: asChild.parentComment?.fromUser.name ?? null,
    };
  }
};

const convertIdeaComment = (raw: Payload): IdeaComment => {
  return {
    id: raw.id,
    text: raw.text,
    ideaId: raw.ideaId,
    fromUser: {
      id: raw.fromUser.id,
      image: raw.fromUser.image,
      name: raw.fromUser.name,
    },
    inReplyToComment: buildInReplyToComment(raw),
    createdAt: new Date(raw.createdAt),
  };
};

export const findManyIdeaComments = async (
  args: FindManyArgs
): Promise<IdeaComment[]> => {
  const raws = await __new_db__.query.ideaComments.findMany({
    ...args,
    ...ideaCommentArgs,
    orderBy: (comments, { asc }) => {
      return asc(comments.createdAt);
    },
  });

  const comments = raws.map((r) => convertIdeaComment(r));
  return comments;
};
