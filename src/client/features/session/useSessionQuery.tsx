import { sessionKeys } from "@/client/features/session/queryKeys";
import { __trpc_old } from "@/client/lib/trpc";
import { useQuery } from "@tanstack/react-query";

export const useSessionQuery = () => {
  const { data: session, ...others } = useQuery({
    queryKey: sessionKeys.session,
    queryFn: () => {
      return __trpc_old.session.query();
    },
  });

  return { session, ...others };
};
