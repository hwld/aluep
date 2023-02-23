import { findAllThemeTags, ThemeTag } from "../../models/themeTag";
import { publicProcedure } from "../../trpc";

export const getAllTags = publicProcedure.query(
  async (): Promise<ThemeTag[]> => {
    const allTags = await findAllThemeTags();
    return allTags;
  }
);
