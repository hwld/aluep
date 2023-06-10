import { db } from "../lib/prismadb";

export type DevelopmentStatus = { id: string; name: string };

export const findDevelopmentStatuses = async (): Promise<
  DevelopmentStatus[]
> => {
  const rawStatuses = await db.developmentStatus.findMany();
  return rawStatuses;
};
