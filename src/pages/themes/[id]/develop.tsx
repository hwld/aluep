import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  themeQueryKey,
  useThemeQuery,
} from "../../../client/features/theme/useThemeQuery";
import { ThemeDevelopPage } from "../../../client/pageComponents/ThemeDevelopPage";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/routers";
import { Routes } from "../../../share/routes";
import { createRepositoryURLParamSchema } from "../../../share/schema";
import { assertString } from "../../../share/utils";
import NotFoundPage from "../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, session, callerContext }) => {
    if (!session) {
      return { redirect: { destination: Routes.home, permanent: false } };
    }

    const themeId = assertString(query.id);

    const caller = appRouter.createCaller(callerContext);
    const theme = await caller.theme.get({ themeId });
    if (!theme) {
      return { notFound: true };
    }

    // すでに開発している場合はお題にリダイレクトする
    const developedData = await caller.theme.developed({ themeId: theme.id });
    if (developedData.developed) {
      return {
        redirect: { destination: Routes.theme(themeId), permanent: false },
      };
    }

    queryClient.setQueryData(themeQueryKey(themeId), theme);
  }
);

const ThemeDevelop: NextPage = () => {
  const router = useRouter();
  const themeId = assertString(router.query.id);

  const createRepositoryData = createRepositoryURLParamSchema.parse(
    router.query
  );

  const { theme } = useThemeQuery(themeId);

  if (!theme) {
    return <NotFoundPage />;
  }

  return (
    <ThemeDevelopPage theme={theme} restoredValues={createRepositoryData} />
  );
};
export default ThemeDevelop;
