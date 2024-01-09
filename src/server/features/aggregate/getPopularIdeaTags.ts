import { IdeaTagAndIdeaCount } from "@/models/ideaTag";
import { findManyIdeaTags } from "@/server/finders/ideaTag";
import { db } from "@/server/lib/prismadb";
import { publicProcedure } from "@/server/lib/trpc";
import { sortedInSameOrder } from "@/share/utils";
import { z } from "zod";

export const getPopularIdeaTags = publicProcedure
  .input(z.object({ limit: z.number() }))
  .query(async ({ input: { limit } }) => {
    const tagAndIdeaCounts: IdeaTagAndIdeaCount[] = await db.$transaction(
      async (tx) => {
        // タグIDと、アイデアの数を取得する
        const _tagIdAndIdeaCounts = await tx.ideaTagOnIdea.groupBy({
          by: ["tagId"],
          _count: { ideaId: true },
          orderBy: {
            _count: {
              ideaId: "desc",
            },
          },
          take: limit,
        });

        // タグ一覧を取得する
        const _tagIds = _tagIdAndIdeaCounts.map((r) => r.tagId);
        const _tags = await findManyIdeaTags({
          where: { id: { in: _tagIds } },
        });

        // _tagIdsに並び順を合わせる
        const _sortedTags = sortedInSameOrder({
          target: _tags,
          base: _tagIds,
          getKey: (t) => t.id,
        });

        return _sortedTags.map(
          (tag, i): IdeaTagAndIdeaCount => ({
            ...tag,
            ideaCount: _tagIdAndIdeaCounts[i]._count.ideaId,
          })
        );
      },
      {
        maxWait: 20000,
        timeout: 60000,
      }
    );

    return tagAndIdeaCounts;
  });
