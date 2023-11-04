import { useSessionQuery } from "@/client/features/session/useSessionQuery";
import { UserEditPage } from "@/client/pageComponents/UserEditPage/UserEditPage";
import NotFoundPage from "@/pages/404";
import { withReactQueryGetServerSideProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { Routes } from "@/share/routes";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ session }) => {
    if (!session) {
      return { redirect: { destination: Routes.home, permanent: false } };
    }
  }
);

export default function UserEdit() {
  const { session, isLoading } = useSessionQuery();

  if (isLoading) {
    return <></>;
  } else if (!session?.user) {
    return <NotFoundPage />;
  }

  return <UserEditPage user={session.user} />;
}
