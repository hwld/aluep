import { UserDelete } from "@/client/pageComponents/UserDelete/UserDelete";
import { PageLayout } from "@/client/ui/PageLayout";
import { withReactQueryGetServerSideProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { Routes } from "@/share/routes";
import { NextPage } from "next";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ session }) => {
    if (!session) {
      return { redirect: { destination: Routes.home, permanent: false } };
    }
  }
);

const UserDeletePage: NextPage = () => {
  return <UserDelete />;
};

export default UserDeletePage;
UserDeletePage.getLayout = (page, { isSideBarOpen }) => {
  return <PageLayout isSideBarOpen={isSideBarOpen}>{page}</PageLayout>;
};
