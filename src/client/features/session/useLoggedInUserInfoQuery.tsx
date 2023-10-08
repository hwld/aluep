import { sessionKeys } from "@/client/features/session/queryKeys";
import { __trpc_old } from "@/client/lib/trpc";
import { useQuery } from "@tanstack/react-query";

export const useLoggedInUserInfoQuery = () => {
  const { data: loggedInUserInfo, ...others } = useQuery({
    queryKey: sessionKeys.loggedInUserInfo,
    queryFn: () => {
      return __trpc_old.me.getMySummary.query();
    },
  });

  return { loggedInUserInfo, ...others };
};
