import { publicProcedure } from "@/server/lib/trpc";
import { findManyDevelopmentMemo } from "@/server/models/developmentMemo";
import { z } from "zod";

export const getAllDevelopmentMemos = publicProcedure
  .input(z.object({ developmentId: z.string() }))
  .query(async ({ input }) => {
    const memos = await findManyDevelopmentMemo({
      where: { developmentId: input.developmentId },
    });

    return memos;
  });
