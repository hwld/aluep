import { publicProcedure } from "../../lib/trpc";
import { findDevelopmentStatuses } from "../../models/developmentStatus";

export const getDevelopmentStatuses = publicProcedure.query(async () => {
  const developmentStatuses = await findDevelopmentStatuses();
  return developmentStatuses;
});
