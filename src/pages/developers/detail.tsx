import { dehydrate, QueryClient } from "@tanstack/react-query";
import { unstable_getServerSession } from "next-auth";
import { useContext } from "react";
import { developerontext } from "../../client/components/DeveloperDetailLinkButton";
import { DeveloperDetailPage } from "../../client/components/DeveloperDetailPage";
import { useDeveloperQuery } from "../../client/hooks/useDeveloperQuery";
import { sessionQuerykey } from "../../client/hooks/useSessionQuery";
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

// TODO: formのエラーハンドリングのためにreact-hook-formを導入する
export default function Detail() {
  const developerId = useContext(developerontext);
  const { developer } = useDeveloperQuery(developerId);

  // if (!developer?.id) {
  //   // ユーザーがいないときはリダイレクトされるからここに到達することはない？
  //   return <div>error</div>;
  // }
  return <DeveloperDetailPage />;
}
