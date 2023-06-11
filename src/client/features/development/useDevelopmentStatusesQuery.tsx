import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";

const developmentStatusesQueryKey = ["developmentStatuses"];

export const useDevelopmentStatusesQuery = () => {
  const { data: developmentStatuses, ...others } = useQuery({
    queryKey: developmentStatusesQueryKey,
    queryFn: () => {
      return trpc.development.getDevelopmentStatuses.query();
    },
    initialData: [],
  });

  return { developmentStatuses, ...others };
};
