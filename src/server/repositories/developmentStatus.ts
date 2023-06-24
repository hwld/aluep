import { DevelopmentStatus } from "@/models/developmentStatus";
import { db } from "@/server/lib/prismadb";

export const findDevelopmentStatuses = async (): Promise<
  DevelopmentStatus[]
> => {
  const rawStatuses = await db.developmentStatus.findMany();
  return rawStatuses;
};
