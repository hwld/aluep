import { publicProcedure } from "@/server/lib/trpc";
import { IdeaTag, findAllIdeaTags } from "@/server/models/ideaTag";

export const getAllTags = publicProcedure.query(
  async (): Promise<IdeaTag[]> => {
    const allTags = await findAllIdeaTags();
    return allTags;
  }
);
