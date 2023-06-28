import { publicProcedure } from "@/server/lib/trpc";
import { findManyDevelopmentMemos } from "@/server/repositories/developmentMemo";
import { z } from "zod";

export const getAllDevelopmentMemos = publicProcedure
  .input(z.object({ developmentId: z.string() }))
  .query(async ({ input }) => {
    const memos = await findManyDevelopmentMemos({
      where: { developmentId: input.developmentId },
    });

    return memos;
  });
