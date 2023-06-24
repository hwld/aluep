import { developmentKeys } from "@/client/features/development/queryKeys";
import { trpc } from "@/client/lib/trpc";
import { useQuery } from "@tanstack/react-query";

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
