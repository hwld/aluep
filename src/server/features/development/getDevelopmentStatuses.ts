import { publicProcedure } from "@/server/lib/trpc";
import { findDevelopmentStatuses } from "@/server/repositories/developmentStatus";

export const getDevelopmentStatuses = publicProcedure.query(async () => {
  const developmentStatuses = await findDevelopmentStatuses();
  return developmentStatuses;
});
