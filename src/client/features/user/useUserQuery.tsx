import { trpc } from "@/client/lib/trpc";

type UseUserQueryArgs = { userId: string };

export const useUserQuery = ({ userId }: UseUserQueryArgs) => {
  const { data: user, ...others } = trpc.user.get.useQuery({
    userId,
  });

  return { user, ...others };
};
