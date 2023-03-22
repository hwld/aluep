import { useQuery } from "@tanstack/react-query";
import { Development } from "../../../server/models/development";
import { trpc } from "../../lib/trpc";
import { ideaQueryKey } from "../idea/useIdeaQuery";

export const developmentsPerPageQueryKey = (ideaId: string, page: number) => {
  const p = isNaN(page) ? 1 : page;
  return [...ideaQueryKey(ideaId), "developments", { page: p }] as const;
};

export type DevelopmentsPerPageData = {
  list: Development[];
  allPages: number;
};

export const useDevelopmentsPerPage = (ideaId: string, page: number) => {
  const { data: developmentsPerPage, ...others } = useQuery({
    queryKey: developmentsPerPageQueryKey(ideaId, page),
    queryFn: (): Promise<DevelopmentsPerPageData> => {
      return trpc.development.getManyByIdea.query({
        page: page.toString(),
        ideaId: ideaId,
      });
    },
    keepPreviousData: true,
  });

  return { developmentsPerPage, ...others };
};
