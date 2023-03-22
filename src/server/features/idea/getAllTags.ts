import { publicProcedure } from "../../lib/trpc";
import { findAllIdeaTags, IdeaTag } from "../../models/ideaTag";

export const getAllTags = publicProcedure.query(
  async (): Promise<IdeaTag[]> => {
    const allTags = await findAllIdeaTags();
    return allTags;
  }
);
