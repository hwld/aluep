import { useRouter } from "next/router";
import {
  developmentQuerykey,
  useDevelopmentQuery,
} from "../../../../../client/features/development/useDevelopmentQuery";
import {
  themeQueryKey,
  useThemeQuery,
} from "../../../../../client/features/theme/useThemeQuery";
import { DevelopmentDetailPage } from "../../../../../client/pageComponents/DevelopmentDetailPage";
import { withReactQueryGetServerSideProps } from "../../../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../../../server/routers";
import { assertString } from "../../../../../share/utils";
import NotFoundPage from "../../../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, callerContext }) => {
    const themeId = assertString(query.id);
    const developmentId = assertString(query.developmentId);

    const caller = appRouter.createCaller(callerContext);

    // お題と開発情報が存在しない場合は404にする
    const theme = await caller.theme.get({ themeId });
    const development = await caller.development.get({
      developmentId: developmentId,
    });
    if (!theme || !development) {
      return { notFound: true };
    }

    queryClient.setQueryData(themeQueryKey(themeId), theme);
    queryClient.setQueryData(developmentQuerykey(developmentId), development);
  }
);

const DevelopmentDetail = () => {
  const router = useRouter();
  const developmentId = assertString(router.query.developmentId);
  const themeId = assertString(router.query.id);
  const { development: development, isLoading: loadingDevelopment } =
    useDevelopmentQuery(developmentId);
  const { theme, isLoading: loadingTheme } = useThemeQuery(themeId);

  if (loadingDevelopment || loadingTheme) {
    return <></>;
  } else if (!development || !theme) {
    return <NotFoundPage />;
  }

  return <DevelopmentDetailPage development={development} theme={theme} />;
};
export default DevelopmentDetail;
