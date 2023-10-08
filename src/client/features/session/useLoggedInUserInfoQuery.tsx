import { trpc } from "@/client/lib/trpc";

export const useLoggedInUserInfoQuery = () => {
  const { data: loggedInUserInfo, ...others } = trpc.me.getMySummary.useQuery();
  return { loggedInUserInfo, ...others };
};
