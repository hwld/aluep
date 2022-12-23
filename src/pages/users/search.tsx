import { NextPage } from "next";
import { UserSearchPage } from "../../client/components/UserSearchPage";
import { searchedUsersQueryKey } from "../../client/hooks/useSearchedUsersQuery";

import { withReactQueryGetServerSideProps } from "../../server/lib/GetServerSidePropsWithReactQuery";
import { urlParamToString } from "../../server/lib/urlParam";
import { appRouter } from "../../server/routers/_app";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, session }) => {
    const caller = appRouter.createCaller({ session });

    const userName = urlParamToString(query.userName, "");

    await queryClient.prefetchQuery(searchedUsersQueryKey(userName), () => {
      return caller.user.searchUser({ userName });
    });
  }
);

const UserSearch: NextPage = () => {
  return <UserSearchPage />;
};
export default UserSearch;
