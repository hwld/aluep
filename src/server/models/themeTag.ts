import { db } from "../lib/prismadb";

export type ThemeTag = {
  id: string;
  createdAt: string;
  name: string;
  updatedAt: string;
};

export const findAllThemeTags = async (): Promise<ThemeTag[]> => {
  const rawTags = await db.appThemeTag.findMany();

  const tags: ThemeTag[] = rawTags.map((raw) => ({
    id: raw.id,
    name: raw.name,
    createdAt: raw.createdAt.toUTCString(),
    updatedAt: raw.updatedAt.toUTCString(),
  }));

  return tags;
};
