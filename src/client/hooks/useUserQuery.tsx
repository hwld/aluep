import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

export const userQueryKey = (userId: string) => ["user", userId];

export const useUserQuery = (userId: string) => {
  const { data: user, ...others } = useQuery({
    queryKey: userQueryKey(userId),
    queryFn: () => {
      return trpc.user.get.query({ userId });
    },
  });

  return { user, ...others };
};
