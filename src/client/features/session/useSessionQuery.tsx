import { sessionKeys } from "@/client/features/session/queryKeys";
import { trpc } from "@/client/lib/trpc";
import { useQuery } from "@tanstack/react-query";

export const useSessionQuery = () => {
  const { data: session, ...others } = useQuery({
    queryKey: sessionKeys.session,
    queryFn: () => {
      return trpc.session.query();
    },
  });

  return { session, ...others };
};
