import { useQuery } from "@tanstack/react-query";
import { Development } from "../../../server/models/development";
import { trpc } from "../../lib/trpc";
import { developmentKeys } from "./queryKeys";

export type DevelopmentsPerPageData = {
  list: Development[];
  allPages: number;
};

export const useDevelopmentsPerPage = (ideaId: string, page: number) => {
  const { data: developmentsPerPage, ...others } = useQuery({
    queryKey: developmentKeys.listPerPage(ideaId, page),
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
