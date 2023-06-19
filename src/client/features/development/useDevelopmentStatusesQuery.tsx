import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { developmentKeys } from "./queryKeys";

export const useDevelopmentStatusesQuery = () => {
  const { data: developmentStatuses, ...others } = useQuery({
    queryKey: developmentKeys.allStatuses,
    queryFn: () => {
      return trpc.development.getDevelopmentStatuses.query();
    },
    initialData: [],
  });

  return { developmentStatuses, ...others };
};
