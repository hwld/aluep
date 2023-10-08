import { developmentKeys } from "@/client/features/dev/queryKeys";
import { __trpc_old } from "@/client/lib/trpc";
import { Development } from "@/models/development";
import { useQuery } from "@tanstack/react-query";

export type DevelopmentsData = {
  list: Development[];
  allPages: number;
};

type UseDevelopmentsByIdeaArgs = { ideaId: string; page: number };

export const useDevsByIdea = ({ ideaId, page }: UseDevelopmentsByIdeaArgs) => {
  const { data: developments, ...others } = useQuery({
    queryKey: developmentKeys.listByIdea(ideaId, page),
    queryFn: (): Promise<DevelopmentsData> => {
      return __trpc_old.development.getManyByIdea.query({
        page: page.toString(),
        ideaId: ideaId,
      });
    },
    keepPreviousData: true,
  });

  return { developments, ...others };
};
