import { NextPage } from "next";
import { useRouter } from "next/router";
import { developmentsPerPageQueryKey } from "../../../../client/features/development/useDevelopmentsPerPage";
import {
  themeQueryKey,
  useThemeQuery,
} from "../../../../client/features/theme/useThemeQuery";
import { ThemeDevelopmentPage } from "../../../../client/pageComponents/ThemeDevelopmentPage";
import { withReactQueryGetServerSideProps } from "../../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../../server/router";
import { paginatedPageSchema } from "../../../../share/schema";
import { assertString } from "../../../../share/utils";
import NotFoundPage from "../../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, callerContext }) => {
    const parsePageResult = paginatedPageSchema.safeParse(query);
    if (!parsePageResult.success) {
      return { notFound: true };
    }
    const { page } = parsePageResult.data;

    const themeId = assertString(query.id);

    const caller = appRouter.createCaller(callerContext);
    const theme = await caller.theme.get({ themeId });
    if (!theme) {
      return { notFound: true };
    }

    await queryClient.prefetchQuery(themeQueryKey(themeId), () =>
      caller.theme.get({ themeId })
    );
    await queryClient.prefetchQuery(
      developmentsPerPageQueryKey(themeId, page),
      () => caller.development.getManyByTheme({ themeId, page })
    );
  }
);

const DevelopmentPage: NextPage = () => {
  const router = useRouter();
  const themeId = assertString(router.query.id);
  const { theme, isLoading } = useThemeQuery(themeId);

  if (isLoading) {
    return <></>;
  } else if (!theme) {
    return <NotFoundPage />;
  }

  return <ThemeDevelopmentPage theme={theme} />;
};
export default DevelopmentPage;
