import { Idea } from "@/models/idea";
import { publicProcedure } from "@/server/lib/trpc";
import { pagingSchema } from "@/share/paging";
import { z } from "zod";

export const getPostedIdeasByUser = publicProcedure
  .input(z.object({ userId: z.string(), page: pagingSchema }))
  .query(async ({}): Promise<{ list: Idea[]; allPages: number }> => {
    //TODO
    // const [postedIdeas, { allPages }] = await paginate({
    //   finder2: ({ input, ...args }) => findManyIdeas({ ...input }),
    //   finderInput: {
    //     args: { where: (ideas, { eq }) => eq(ideas.userId, input.userId) },
    //     loggedInUserId: ctx.session?.user.id,
    //   },
    //   counter: ({ args }) => db.idea.count(args),
    //   counter: async () => 1,
    //   pagingData: { page, limit: PAGE_LIMIT.postedIdeas },
    // });

    return { list: [], allPages: 0 };
  });
