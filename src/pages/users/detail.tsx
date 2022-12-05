import { dehydrate, QueryClient } from "@tanstack/react-query";
import { unstable_getServerSession } from "next-auth";
import { UserDetailPage } from "../../client/components/UserDetailPage";
import {
  sessionQuerykey,
  useSessionQuery,
} from "../../client/hooks/useSessionQuery";
import { GetServerSidePropsWithReactQuery } from "../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../server/routers/_app";
import { authOptions } from "../api/auth/[...nextauth]";

export const getServerSideProps: GetServerSidePropsWithReactQuery = async ({
  req,
  res,
}) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  const caller = appRouter.createCaller({ session });
  //const theme = await caller.user.getPostTheme({  });
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

// TODO: formのエラーハンドリングのためにreact-hook-formを導入する
export default function Detail() {
  const { session } = useSessionQuery();

  if (session?.user.id === undefined) {
    return <div>error</div>;
  }

  return <UserDetailPage user={session.user} />;
}
