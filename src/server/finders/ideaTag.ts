import { IdeaTag } from "@/models/ideaTag";
import { FindManyArgs } from "@/server/finders";
import { db } from "@/server/lib/prismadb";
import { Prisma } from "@prisma/client";

const ideaTagArgs = {} satisfies Prisma.IdeaTagDefaultArgs;

const convertIdeaTag = (
  raw: Prisma.IdeaTagGetPayload<typeof ideaTagArgs>
): IdeaTag => ({
  ...raw,
  createdAt: raw.createdAt.toUTCString(),
  updatedAt: raw.createdAt.toUTCString(),
});

type FindIdeaTagsArgs = FindManyArgs<
  typeof db.ideaTag,
  { tx?: Prisma.TransactionClient }
>;

export const findManyIdeaTags = async ({
  tx,
  ...args
}: FindIdeaTagsArgs): Promise<IdeaTag[]> => {
  const client = tx ? tx : db;

  const rawTags = await client.ideaTag.findMany({ ...args });

  const tags: IdeaTag[] = rawTags.map(convertIdeaTag);
  return tags;
};
