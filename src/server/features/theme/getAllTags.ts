import { publicProcedure } from "../../lib/trpc";
import { findAllThemeTags, ThemeTag } from "../../models/themeTag";

export const getAllTags = publicProcedure.query(
  async (): Promise<ThemeTag[]> => {
    const allTags = await findAllThemeTags();
    return allTags;
  }
);
