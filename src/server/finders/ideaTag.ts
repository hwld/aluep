import { IdeaTag } from "@/models/ideaTag";
import { DbArgs, DbPayload, __new_db__ } from "@/server/lib/db";

type FindManyArgs = DbArgs<"ideaTags", "findMany">;
type Payload = DbPayload<typeof __new_db__.query.ideaTags.findFirst>;

const convertIdeaTag = (raw: Payload): IdeaTag => ({ ...raw });

export const findManyIdeaTags = async (
  args: FindManyArgs,
  tx?: typeof __new_db__
): Promise<IdeaTag[]> => {
  const client = tx ? tx : __new_db__;

  const raws = await client.query.ideaTags.findMany({ ...args });

  const tags = raws.map(convertIdeaTag);
  return tags;
};
