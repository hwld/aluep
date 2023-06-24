import { userKeys } from "@/client/features/user/queryKeys";
import { UserSearchPage } from "@/client/pageComponents/UserSearchPage";
import { withReactQueryGetServerSideProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { urlParamToString } from "@/server/lib/urlParam";
import { appRouter } from "@/server/router";
import { NextPage } from "next";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ gsspContext: { query }, queryClient, callerContext }) => {
    const caller = appRouter.createCaller(callerContext);

    const userName = urlParamToString(query.userName, "");

    await queryClient.prefetchQuery(userKeys.searchedList(userName), () =>
      caller.user.search({ userName })
    );
  }
);

const UserSearch: NextPage = () => {
  return <UserSearchPage />;
};
export default UserSearch;
