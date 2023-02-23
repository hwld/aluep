import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

const loggedInUserInfoQueryKey = (userId: string) =>
  ["loggedInUserInfo", userId] as const;

export const useLoggedInUserInfoQuery = (userId: string) => {
  const { data: loggedInUserInfo, ...others } = useQuery({
    queryKey: loggedInUserInfoQueryKey(userId),
    queryFn: () => {
      return trpc.me.getInfo.query();
    },
  });

  return { loggedInUserInfo, ...others };
};
