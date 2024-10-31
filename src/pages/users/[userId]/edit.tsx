import { useSessionQuery } from "@/client/features/session/useSessionQuery";
import { UserEdit } from "@/client/pageComponents/UserEdit/UserEdit";
import { PageLayout } from "@/client/ui/PageLayout";
import NotFoundPage from "@/pages/404";
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

const UserEditPage: NextPage = () => {
  const { session, isLoading } = useSessionQuery();

  if (isLoading) {
    return <></>;
  } else if (!session?.user) {
    return <NotFoundPage />;
  }

  return <UserEdit user={session.user} />;
};

export default UserEditPage;

UserEditPage.getLayout = (page, { isSideBarOpen }) => {
  return <PageLayout isSideBarOpen={isSideBarOpen}>{page}</PageLayout>;
};
