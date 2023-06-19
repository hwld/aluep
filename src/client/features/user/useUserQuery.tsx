import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { userKeys } from "./queryKeys";

type UseUserQueryArgs = { userId: string };

export const useUserQuery = ({ userId }: UseUserQueryArgs) => {
  const { data: user, ...others } = useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => {
      return trpc.user.get.query({ userId });
    },
  });

  return { user, ...others };
};
