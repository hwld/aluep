import { dehydrate, QueryClient } from "@tanstack/react-query";
import { unstable_getServerSession } from "next-auth";
import { UserEditPage } from "../../client/components/UserEditPage";
import {
  sessionQuerykey,
  useSessionQuery,
} from "../../client/hooks/useSessionQuery";
import { GetServerSidePropsWithReactQuery } from "../../server/lib/GetServerSidePropsWithReactQuery";
import { authOptions } from "../api/auth/[...nextauth]";

export const getServerSideProps: GetServerSidePropsWithReactQuery = async ({
  req,
  res,
}) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  // セッションがないときはホームにリダイレクトする
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const queryClient = new QueryClient();
  queryClient.setQueryData(sessionQuerykey, session);
  const dehydratedState = dehydrate(queryClient);

  return {
    props: {
      dehydratedState,
    },
  };
};

export default function Profile() {
  const { session } = useSessionQuery();

  if (!session?.user) {
    // ユーザーがいないときはリダイレクトされるからここに到達することはない？
    return <div>error</div>;
  }

  return <UserEditPage user={session.user} />;
}
