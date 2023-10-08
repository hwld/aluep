import { trpc } from "@/client/lib/trpc";
import { Development } from "@/models/development";

export type DevelopmentsData = {
  list: Development[];
  allPages: number;
};

type UseDevelopmentsByIdeaArgs = { ideaId: string; page: number };

export const useDevsByIdea = ({ ideaId, page }: UseDevelopmentsByIdeaArgs) => {
  const { data: developments, ...others } =
    trpc.development.getManyByIdea.useQuery(
      { page, ideaId: ideaId },
      { keepPreviousData: true }
    );

  return { developments, ...others };
};
