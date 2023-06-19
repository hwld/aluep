import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { userKeys } from "./queryKeys";

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
