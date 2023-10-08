import { developmentKeys } from "@/client/features/dev/queryKeys";
import { __trpc_old } from "@/client/lib/trpc";
import { useQuery } from "@tanstack/react-query";

export const useDevStatusesQuery = () => {
  const { data: developmentStatuses, ...others } = useQuery({
    queryKey: developmentKeys.allStatuses,
    queryFn: () => {
      return __trpc_old.development.getDevelopmentStatuses.query();
    },
    initialData: [],
  });

  return { developmentStatuses, ...others };
};
