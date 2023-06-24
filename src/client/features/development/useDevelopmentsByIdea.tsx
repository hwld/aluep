import { developmentKeys } from "@/client/features/development/queryKeys";
import { trpc } from "@/client/lib/trpc";
import { Development } from "@/models/development";
import { useQuery } from "@tanstack/react-query";

export type DevelopmentsData = {
  list: Development[];
  allPages: number;
};

type UseDevelopmentsByIdeaArgs = { ideaId: string; page: number };

export const useDevelopmentsByIdea = ({
  ideaId,
  page,
}: UseDevelopmentsByIdeaArgs) => {
  const { data: developments, ...others } = useQuery({
    queryKey: developmentKeys.listByIdea(ideaId, page),
    queryFn: (): Promise<DevelopmentsData> => {
      return trpc.development.getManyByIdea.query({
        page: page.toString(),
        ideaId: ideaId,
      });
    },
    keepPreviousData: true,
  });

  return { developments, ...others };
};
