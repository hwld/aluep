import { sessionKeys } from "@/client/features/session/queryKeys";
import { trpc } from "@/client/lib/trpc";
import { useQuery } from "@tanstack/react-query";

export const useLoggedInUserInfoQuery = () => {
  const { data: loggedInUserInfo, ...others } = useQuery({
    queryKey: sessionKeys.loggedInUserInfo,
    queryFn: () => {
      return trpc.me.getMySummary.query();
    },
  });

  return { loggedInUserInfo, ...others };
};
