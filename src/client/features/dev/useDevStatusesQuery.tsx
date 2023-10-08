import { trpc } from "@/client/lib/trpc";

export const useDevStatusesQuery = () => {
  const { data: developmentStatuses, ...others } =
    trpc.development.getDevelopmentStatuses.useQuery(undefined, {
      initialData: [],
    });

  return { developmentStatuses, ...others };
};
