import { userKeys } from "@/client/features/user/queryKeys";
import { __trpc_old } from "@/client/lib/trpc";
import { useQuery } from "@tanstack/react-query";

type UseSearchedUsersQueryArgs = { userName: string };

export const useSearchedUsersQuery = ({
  userName,
}: UseSearchedUsersQueryArgs) => {
  const { data: searchedUserResult, ...others } = useQuery({
    queryKey: userKeys.searchedList(userName),
    queryFn: () => {
      return __trpc_old.user.search.query({ userName: userName });
    },
    keepPreviousData: true,
  });
  return { searchedUserResult, ...others };
};
