import { useRouter } from "next/router";
import {
  developerQuerykey,
  useDeveloperQuery,
} from "../../../../../client/features/developer/useDeveloperQuery";
import {
  themeQueryKey,
  useThemeQuery,
} from "../../../../../client/features/theme/useThemeQuery";
import { DeveloperDetailPage } from "../../../../../client/pageComponents/DeveloperDetailPage";
import { withReactQueryGetServerSideProps } from "../../../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../../../server/routers";
import { assertString } from "../../../../../share/utils";
import NotFoundPage from "../../../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, callerContext }) => {
    const themeId = assertString(query.id);
    const developerId = assertString(query.developerId);

    const caller = appRouter.createCaller(callerContext);

    // お題、開発者が存在しない場合は404にする
    const theme = await caller.theme.get({ themeId });
    const developer = await caller.developer.get({ developerId });
    if (!theme || !developer) {
      return { notFound: true };
    }

    queryClient.setQueryData(themeQueryKey(themeId), theme);
    queryClient.setQueryData(developerQuerykey(developerId), developer);
  }
);

const DeveloperDetail = () => {
  const router = useRouter();
  const developerId = assertString(router.query.developerId);
  const themeId = assertString(router.query.id);
  const { developer } = useDeveloperQuery(developerId);
  const { theme } = useThemeQuery(themeId);

  if (!developer || !theme) {
    return <NotFoundPage />;
  }

  return <DeveloperDetailPage developer={developer} theme={theme} />;
};
export default DeveloperDetail;
