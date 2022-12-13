import { UserEditPage } from "../../client/components/UserEditPage";
import { useSessionQuery } from "../../client/hooks/useSessionQuery";
import { withReactQueryGetServerSideProps } from "../../server/lib/GetServerSidePropsWithReactQuery";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ session }) => {
    if (!session) {
      return { redirect: { destination: "/", permanent: false } };
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
