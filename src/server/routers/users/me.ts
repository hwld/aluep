import { z } from "zod";
import { publicProcedure, router } from "../../trpc";

export const meRoute = router({
  update: publicProcedure.input(z.object({})).mutation(() => {}),
  delete: publicProcedure.input(z.object({})).mutation(() => {}),
});
