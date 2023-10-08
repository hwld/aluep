import { trpc } from "@/client/lib/trpc";

type UseSearchedUsersQueryArgs = { userName: string };

export const useSearchedUsersQuery = ({
  userName,
}: UseSearchedUsersQueryArgs) => {
  const { data: searchedUserResult, ...others } = trpc.user.search.useQuery(
    { userName },
    { keepPreviousData: true }
  );
  return { searchedUserResult, ...others };
};
