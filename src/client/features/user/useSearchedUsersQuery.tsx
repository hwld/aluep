import { userKeys } from "@/client/features/user/queryKeys";
import { trpc } from "@/client/lib/trpc";
import { useQuery } from "@tanstack/react-query";

type UseSearchedUsersQueryArgs = { userName: string };

export const useSearchedUsersQuery = ({
  userName,
}: UseSearchedUsersQueryArgs) => {
  const { data: searchedUserResult, ...others } = useQuery({
    queryKey: userKeys.searchedList(userName),
    queryFn: () => {
      return trpc.user.search.query({ userName: userName });
    },
    keepPreviousData: true,
  });
  return { searchedUserResult, ...others };
};
