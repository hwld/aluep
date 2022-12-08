import { dehydrate, QueryClient } from "@tanstack/react-query";
import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { DeveloperDetailPage } from "../../../client/components/DeveloperDetailPage";
import {
  developerQuerykey,
  useDeveloperQuery,
} from "../../../client/hooks/useDeveloperQuery";
import { GetServerSidePropsWithReactQuery } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { ThemeDeveloper } from "../../../server/models/themeDeveloper";
import { appRouter } from "../../../server/routers/_app";
import { authOptions } from "../../api/auth/[...nextauth]";

type Props = { developer: ThemeDeveloper };
export const getServerSideProps: GetServerSidePropsWithReactQuery = async ({
  req,
  res,
  query,
}) => {
  const { id: developerId } = query;
  if (typeof developerId !== "string") {
    return { notFound: true };
  }

  // セッションを取得する
  const session = await unstable_getServerSession(req, res, authOptions);
  const caller = appRouter.createCaller({ session });
  const queryClient = new QueryClient();
  queryClient.setQueryData(developerQuerykey(developerId), developerId);

  const dehydratedState = dehydrate(queryClient);

  return { props: { dehydratedState } };
};

export const DeveloperDetail = () => {
  const router = useRouter();
  const developerId = router.query.id as string;
  const { developer } = useDeveloperQuery(developerId);

  if (!developer) {
    return <div>Error</div>;
  }

  return <DeveloperDetailPage />;
};
export default DeveloperDetail;
