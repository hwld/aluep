import { z } from "zod";
import { findThemeDeveloper } from "../../models/themeDeveloper";
import { publicProcedure } from "../../trpc";

export const getDeveloper = publicProcedure
  .input(z.object({ developerId: z.string().min(1).max(100) }))
  .query(async ({ input, ctx }) => {
    const developer = await findThemeDeveloper(
      input.developerId,
      ctx.session?.user.id
    );
    return developer;
  });
