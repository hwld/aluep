import { DevStatus } from "@/models/developmentStatus";
import { db } from "@/server/lib/prismadb";

export const findDevelopmentStatuses = async (): Promise<DevStatus[]> => {
  const rawStatuses = await db.developmentStatus.findMany();
  return rawStatuses;
};
