import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { sessionKeys } from "./queryKeys";

export const useLoggedInUserInfoQuery = () => {
  const { data: loggedInUserInfo, ...others } = useQuery({
    queryKey: sessionKeys.loggedInUserInfo,
    queryFn: () => {
      return trpc.me.getMySummary.query();
    },
  });

  return { loggedInUserInfo, ...others };
};
