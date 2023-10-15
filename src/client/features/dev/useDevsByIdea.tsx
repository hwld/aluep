import { trpc } from "@/client/lib/trpc";
import { Dev } from "@/models/dev";

export type DevsData = {
  list: Dev[];
  allPages: number;
};

type UseDevsByIdeaArgs = { ideaId: string; page: number };

export const useDevsByIdea = ({ ideaId, page }: UseDevsByIdeaArgs) => {
  const { data: devs, ...others } = trpc.dev.getManyByIdea.useQuery(
    { page, ideaId: ideaId },
    { keepPreviousData: true }
  );

  return { devs, ...others };
};
