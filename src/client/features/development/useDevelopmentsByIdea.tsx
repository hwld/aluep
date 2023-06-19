import { useQuery } from "@tanstack/react-query";
import { Development } from "../../../server/models/development";
import { trpc } from "../../lib/trpc";
import { developmentKeys } from "./queryKeys";

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
