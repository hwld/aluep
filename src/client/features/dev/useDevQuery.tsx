import { developmentKeys } from "@/client/features/dev/queryKeys";
import { __trpc_old } from "@/client/lib/trpc";
import { useQuery } from "@tanstack/react-query";

type UseDevelopmentQueryArgs = { developmentId: string };

export const useDevQuery = ({ developmentId }: UseDevelopmentQueryArgs) => {
  const { data: development, ...others } = useQuery({
    queryKey: developmentKeys.detail(developmentId),
    queryFn: () => {
      return __trpc_old.development.get.query({ developmentId: developmentId });
    },
  });

  return { development, ...others };
};
