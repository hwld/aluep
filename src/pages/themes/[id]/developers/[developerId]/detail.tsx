import { dehydrate, QueryClient } from "@tanstack/react-query";
import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { DeveloperDetailPage } from "../../../../../client/components/DeveloperDetailPage";
import {
  developerQuerykey,
  useDeveloperQuery,
} from "../../../../../client/hooks/useDeveloperQuery";
import { useThemeQuery } from "../../../../../client/hooks/useThemeQuery";
import { GetServerSidePropsWithReactQuery } from "../../../../../server/lib/GetServerSidePropsWithReactQuery";
import { authOptions } from "../../../../api/auth/[...nextauth]";

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
  const queryClient = new QueryClient();
  queryClient.setQueryData(developerQuerykey(developerId), "developer");

  const dehydratedState = dehydrate(queryClient);

  return { props: { dehydratedState } };
};

export const DeveloperDetail = () => {
  const router = useRouter();
  const developerId = router.query.developerId as string;
  const themeId = router.query.id as string;
  const { developer } = useDeveloperQuery(developerId);
  const { theme } = useThemeQuery(themeId);

  if (!developer || !theme) {
    return <div>Error</div>;
  }

  return <DeveloperDetailPage developer={developer} theme={theme} />;
};
export default DeveloperDetail;
