import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { userKeys } from "./queryKeys";

export const useUserQuery = (userId: string) => {
  const { data: user, ...others } = useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => {
      return trpc.user.get.query({ userId });
    },
  });

  return { user, ...others };
};
