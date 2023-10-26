import { IdeaTag } from "@/models/ideaTag";
import { findManyIdeaTags } from "@/server/finders/ideaTag";
import { publicProcedure } from "@/server/lib/trpc";

export const getAllTags = publicProcedure.query(
  async (): Promise<IdeaTag[]> => {
    const allTags = await findManyIdeaTags({});
    return allTags;
  }
);
