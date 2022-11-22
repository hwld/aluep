import { z } from "zod";
import { prisma } from "../prismadb";

export const themeTagSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type ThemeTag = z.infer<typeof themeTagSchema>;

export const findAllThemeTags = async (): Promise<ThemeTag[]> => {
  const rawTags = await prisma.appThemeTag.findMany();

  const tags: ThemeTag[] = rawTags.map((raw) => ({
    id: raw.id,
    name: raw.name,
    createdAt: raw.createdAt.toUTCString(),
    updatedAt: raw.updatedAt.toUTCString(),
  }));

  return tags;
};
