import { Prisma } from "@prisma/client";
import { z } from "zod";
import { OmitStrict } from "../../types/OmitStrict";
import { prisma } from "../prismadb";

export const themeCommentSchema = z.object({
  id: z.string(),
  comment: z.string(),
  themeId: z.string(),
  fromUser: z.object({
    id: z.string(),
    name: z.string().nullable(),
    image: z.string().nullable(),
  }),
  // nullの時は返信元があったが削除されている。
  // undefinedの時は返信元がそもそもないことを表している。
  // nullとundefinedで区別するのはどうなんだろうと思ったが、とりあえずシンプルにやってみる
  inReplyToCommentId: z.string().nullable().optional(),
});

type ThemeComment = z.infer<typeof themeCommentSchema>;

const themeCommentArgs = {
  select: {
    id: true,
    comment: true,
    themeId: true,
    fromUser: true,
    // このコメントがChildのParentChildアイテムを取得する
    asChild: { select: { parentCommentId: true } },
  },
} satisfies Prisma.AppThemeCommentArgs;

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
    inReplyToCommentId: raw.asChild?.parentCommentId,
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
  const rawComments = await prisma.appThemeComment.findMany({
    orderBy: { createdAt: "desc", ...orderBy },
    ...args,
    ...themeCommentArgs,
  });

  const comments = rawComments.map((raw) => {
    return convertThemeComment(raw);
  });

  return comments;
};
