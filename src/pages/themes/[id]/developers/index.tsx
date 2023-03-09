import { NextPage } from "next";
import { useRouter } from "next/router";
import { developersPerPageQueryKey } from "../../../../client/features/developer/useDevelopersPerPage";
import {
  themeQueryKey,
  useThemeQuery,
} from "../../../../client/features/theme/useThemeQuery";
import { ThemeDeveloperPage } from "../../../../client/pageComponents/ThemeDeveloperPage";
import { withReactQueryGetServerSideProps } from "../../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../../server/routers";
import { pageObjSchema } from "../../../../share/schema";
import { assertString } from "../../../../share/utils";
import NotFoundPage from "../../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, callerContext }) => {
    const parsePageResult = pageObjSchema.safeParse(query);
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
      developersPerPageQueryKey(themeId, page),
      () => caller.developer.getManyByTheme({ themeId, page })
    );
  }
);

const DeveloperPage: NextPage = () => {
  const router = useRouter();
  const themeId = assertString(router.query.id);
  const { theme, isLoading } = useThemeQuery(themeId);

  if (isLoading) {
    return <></>;
  } else if (!theme) {
    return <NotFoundPage />;
  }

  return <ThemeDeveloperPage theme={theme} />;
};
export default DeveloperPage;
