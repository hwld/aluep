import { NextPage } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { GetServerSidePropsWithReactQuery } from "../../server/lib/GetServerSidePropsWithReactQuery";
import { sessionQuerykey } from "../../client/hooks/useSessionQuery";
import { UserDeletepage } from "../../client/components/UserDeletePage";

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
  await queryClient.prefetchQuery(sessionQuerykey, () => session);
  const dehydratedState = dehydrate(queryClient);

  return {
    props: {
      dehydratedState,
    },
  };
};

const DeleteUser: NextPage = () => {
  return <UserDeletepage />;
};

export default DeleteUser;
