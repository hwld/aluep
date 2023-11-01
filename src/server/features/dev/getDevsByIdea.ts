import { Dev } from "@/models/dev";
import { publicProcedure } from "@/server/lib/trpc";
import { pagingSchema } from "@/share/paging";
import { z } from "zod";

export const getDevsByIdea = publicProcedure
  .input(z.object({ ideaId: z.string(), page: pagingSchema }))
  .query(async ({}): Promise<{ list: Dev[]; allPages: number }> => {
    // TODO:
    // const [devs, { allPages }] = await paginate({
    //   finderInput: {
    //     where: { ideaId: input.ideaId },
    //     loggedInUserId: ctx.session?.user.id,
    //   },
    //   finder: (args) => findManyDevs({ ...args.input, ...args }),
    //   counter: ({ loggedInUserId: _, ...others }) =>
    //     db.development.count(others),
    //   pagingData: { page, limit: PAGE_LIMIT.devs },
    // });

    return { list: [], allPages: 1 };
  });
