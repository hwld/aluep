import { IdeaTag } from "@/models/ideaTag";
import { db } from "@/server/lib/prismadb";

export const findAllIdeaTags = async (): Promise<IdeaTag[]> => {
  const rawTags = await db.ideaTag.findMany();

  const tags: IdeaTag[] = rawTags.map((raw) => ({
    id: raw.id,
    name: raw.name,
    createdAt: raw.createdAt.toUTCString(),
    updatedAt: raw.updatedAt.toUTCString(),
  }));

  return tags;
};
