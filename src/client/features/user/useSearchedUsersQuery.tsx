import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { userKeys } from "./queryKeys";

export const useSearchedUsersQuery = (userName: string) => {
  const { data: searchedUserResult, ...others } = useQuery({
    queryKey: userKeys.searchedList(userName),
    queryFn: () => {
      return trpc.user.search.query({ userName: userName });
    },
    keepPreviousData: true,
  });
  return { searchedUserResult, ...others };
};
