import { findManyDevMemos } from "@/server/finders/devMemo";
import { publicProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export const getAllDevMemos = publicProcedure
  .input(z.object({ devId: z.string() }))
  .query(async ({ input }) => {
    const memos = await findManyDevMemos({
      where: (devMemos, { eq }) => {
        return eq(devMemos.developmentId, input.devId);
      },
    });

    return memos;
  });
