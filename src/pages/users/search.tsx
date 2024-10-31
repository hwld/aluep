import { UserSearch } from "@/client/pageComponents/UserSearch/UserSearch";
import { PageLayout } from "@/client/ui/PageLayout";
import { withReactQueryGetServerSideProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { urlParamToString } from "@/server/lib/urlParam";
import { NextPage } from "next";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ gsspContext: { query }, trpcStore }) => {
    const userName = urlParamToString(query.userName, "");

    await trpcStore.user.search.prefetch({ userName });
  }
);

const UserSearchPage: NextPage = () => {
  return <UserSearch />;
};
export default UserSearchPage;

UserSearchPage.getLayout = (page, { isSideBarOpen }) => {
  return <PageLayout isSideBarOpen={isSideBarOpen}>{page}</PageLayout>;
};
