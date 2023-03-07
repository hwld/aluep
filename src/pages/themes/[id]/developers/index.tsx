import { NextPage } from "next";
import { useRouter } from "next/router";
import { paginatedDevelopersQueryKey } from "../../../../client/features/developer/usePaginatedDeveloperQueery";
import {
  themeQueryKey,
  useThemeQuery,
} from "../../../../client/features/theme/useThemeQuery";
import { ThemeDeveloperPage } from "../../../../client/pageComponents/ThemeDeveloperPage";
import { withReactQueryGetServerSideProps } from "../../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../../server/routers";
import { assertString } from "../../../../share/utils";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, callerContext }) => {
    //TODO
    const { page } = query;

    const themeId = assertString(query.id);

    if (typeof page === "object") {
      throw new Error();
    }

    const caller = appRouter.createCaller(callerContext);
    const theme = await caller.theme.get({ themeId });
    if (!theme) {
      return { notFound: true };
    }

    await queryClient.prefetchQuery(themeQueryKey(themeId), () =>
      caller.theme.get({ themeId })
    );
    await queryClient.prefetchQuery(
      paginatedDevelopersQueryKey(themeId, Number(page)),
      () => caller.developer.getManyByTheme({ themeId, page })
    );
  }
);

const DeveloperPage: NextPage = () => {
  const router = useRouter();
  const themeId = assertString(router.query.id);
  const { theme } = useThemeQuery(themeId);

  if (!theme) {
    return <></>;
  }

  return <ThemeDeveloperPage theme={theme} />;
};
export default DeveloperPage;
