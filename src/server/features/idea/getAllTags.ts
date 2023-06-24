import { IdeaTag } from "@/models/ideaTag";
import { publicProcedure } from "@/server/lib/trpc";
import { findAllIdeaTags } from "@/server/repositories/ideaTag";

export const getAllTags = publicProcedure.query(
  async (): Promise<IdeaTag[]> => {
    const allTags = await findAllIdeaTags();
    return allTags;
  }
);
