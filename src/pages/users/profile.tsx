import { useSessionQuery } from "../../client/features/session/useSessionQuery";
import { UserEditPage } from "../../client/pageComponents/UserEditPage";
import { withReactQueryGetServerSideProps } from "../../server/lib/GetServerSidePropsWithReactQuery";
import { Routes } from "../../share/routes";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ session }) => {
    if (!session) {
      return { redirect: { destination: Routes.home, permanent: false } };
    }
  }
);

export default function Profile() {
  const { session } = useSessionQuery();

  if (!session?.user) {
    // ユーザーがいないときはリダイレクトされるからここに到達することはない？
    return <div>error</div>;
  }

  return <UserEditPage user={session.user} />;
}
