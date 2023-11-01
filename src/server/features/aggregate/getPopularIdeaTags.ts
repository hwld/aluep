import { IdeaTagAndIdeaCount } from "@/models/ideaTag";
import { dbSchema } from "@/server/dbSchema";
import { findManyIdeaTags } from "@/server/finders/ideaTag";
import { __new_db__ } from "@/server/lib/db";
import { publicProcedure } from "@/server/lib/trpc";
import { sortedInSameOrder } from "@/share/utils";
import { desc, sql } from "drizzle-orm";
import { z } from "zod";

export const getPopularIdeaTags = publicProcedure
  .input(z.object({ limit: z.number() }))
  .query(async ({ input: { limit } }) => {
    const tagAndIdeaCounts: IdeaTagAndIdeaCount[] =
      await __new_db__.transaction(async (tx) => {
        // タグIDと、アイデアの数を取得する
        const _tagIdAndIdeaCount = await tx
          .select({
            tagId: dbSchema.ideaTagOnIdeas.tagId,
            ideaCount: sql<number>`count (${dbSchema.ideaTagOnIdeas.ideaId})`,
          })
          .from(dbSchema.ideaTagOnIdeas)
          .groupBy(({ tagId }) => tagId)
          .orderBy(({ ideaCount }) => desc(ideaCount))
          .limit(limit);

        // タグ一覧を取得する
        const _tagIds = _tagIdAndIdeaCount.map((r) => r.tagId);
        const _tags =
          _tagIds.length === 0
            ? []
            : await findManyIdeaTags(
                {
                  where: (tags, { inArray }) => {
                    return inArray(tags.id, _tagIds);
                  },
                },
                tx
              );

        // _tagIdsに並び順を合わせる
        const _sortedTags = sortedInSameOrder({
          target: _tags,
          base: _tagIds,
          getKey: (t) => t.id,
        });

        return _sortedTags.map(
          (tag, i): IdeaTagAndIdeaCount => ({
            ...tag,
            ideaCount: _tagIdAndIdeaCount[i].ideaCount,
          })
        );
      });

    return tagAndIdeaCounts;
  });
