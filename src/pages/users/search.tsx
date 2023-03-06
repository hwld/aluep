import { NextPage } from "next";
import { searchedUsersQueryKey } from "../../client/features/user/useSearchedUsersQuery";
import { UserSearchPage } from "../../client/pageComponents/UserSearchPage";

import { withReactQueryGetServerSideProps } from "../../server/lib/GetServerSidePropsWithReactQuery";
import { urlParamToString } from "../../server/lib/urlParam";
import { appRouter } from "../../server/routers";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, callerContext }) => {
    const caller = appRouter.createCaller(callerContext);

    const userName = urlParamToString(query.userName, "");

    await queryClient.prefetchQuery(searchedUsersQueryKey(userName), () =>
      caller.user.searchUser({ userName })
    );
  }
);

const UserSearch: NextPage = () => {
  return <UserSearchPage />;
};
export default UserSearch;
