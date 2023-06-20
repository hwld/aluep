import { z } from "zod";
import { publicProcedure } from "../../lib/trpc";
import { findManyDevelopmentMemo } from "../../models/developmentMemo";

export const getAllDevelopmentMemos = publicProcedure
  .input(z.object({ developmentId: z.string() }))
  .query(async ({ input }) => {
    const memos = await findManyDevelopmentMemo({
      where: { developmentId: input.developmentId },
    });

    return memos;
  });
