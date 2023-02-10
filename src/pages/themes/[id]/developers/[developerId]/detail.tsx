import { useRouter } from "next/router";
import { DeveloperDetailPage } from "../../../../../client/components/DeveloperDetailPage";
import {
  developerQuerykey,
  useDeveloperQuery,
} from "../../../../../client/hooks/useDeveloperQuery";
import {
  themeQueryKey,
  useThemeQuery,
} from "../../../../../client/hooks/useThemeQuery";
import { withReactQueryGetServerSideProps } from "../../../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../../../server/routers/_app";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, callerContext }) => {
    const { id: themeId, developerId } = query;
    if (typeof themeId !== "string" || typeof developerId !== "string") {
      return { notFound: true };
    }

    const caller = appRouter.createCaller(callerContext);

    // お題、開発者が存在しない場合は404にする
    const theme = await caller.theme.get({ themeId });
    const developer = await caller.themeDeveloper.get({ developerId });
    if (!theme || !developer) {
      return { notFound: true };
    }

    queryClient.setQueryData(themeQueryKey(themeId), theme);
    queryClient.setQueryData(developerQuerykey(developerId), developer);
  }
);

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
