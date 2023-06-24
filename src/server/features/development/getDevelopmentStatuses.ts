import { publicProcedure } from "@/server/lib/trpc";
import { findDevelopmentStatuses } from "@/server/models/developmentStatus";

export const getDevelopmentStatuses = publicProcedure.query(async () => {
  const developmentStatuses = await findDevelopmentStatuses();
  return developmentStatuses;
});
