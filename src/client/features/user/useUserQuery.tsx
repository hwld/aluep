import { userKeys } from "@/client/features/user/queryKeys";
import { __trpc_old } from "@/client/lib/trpc";
import { useQuery } from "@tanstack/react-query";

type UseUserQueryArgs = { userId: string };

export const useUserQuery = ({ userId }: UseUserQueryArgs) => {
  const { data: user, ...others } = useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => {
      return __trpc_old.user.get.query({ userId });
    },
  });

  return { user, ...others };
};
