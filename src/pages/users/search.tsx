import { UserSearchPage } from "@/client/pageComponents/UserSearchPage/UserSearchPage";
import { withReactQueryGetServerSideProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { urlParamToString } from "@/server/lib/urlParam";
import { NextPage } from "next";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ gsspContext: { query }, trpcStore }) => {
    const userName = urlParamToString(query.userName, "");

    await trpcStore.user.search.prefetch({ userName });
  }
);

const UserSearch: NextPage = () => {
  return <UserSearchPage />;
};
export default UserSearch;
