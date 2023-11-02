import { IdeaTag } from "@/models/ideaTag";
import { db } from "@/server/lib/prismadb";
import { OmitStrict } from "@/types/OmitStrict";
import { Prisma } from "@prisma/client";

const ideaTagArgs = {} satisfies Prisma.IdeaTagDefaultArgs;

const convertIdeaTag = (
  raw: Prisma.IdeaTagGetPayload<typeof ideaTagArgs>
): IdeaTag => ({
  ...raw,
  createdAt: raw.createdAt.toUTCString(),
  updatedAt: raw.createdAt.toUTCString(),
});

export const findManyIdeaTags = async (
  args: OmitStrict<Prisma.IdeaTagFindManyArgs, "include" | "select">,
  tx?: Prisma.TransactionClient
): Promise<IdeaTag[]> => {
  const client = tx ? tx : db;

  const rawTags = await client.ideaTag.findMany({ ...args });

  const tags: IdeaTag[] = rawTags.map(convertIdeaTag);
  return tags;
};
