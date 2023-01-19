import { NextPage } from "next";
import { useRouter } from "next/router";
import { ThemeDeveloperPage } from "../../../../client/components/ThemeDeveloperPage";
import { themeLikingUsersQueryKey } from "../../../../client/hooks/useThemeLikingUsersQuery";
import {
  themeQueryKey,
  useThemeQuery,
} from "../../../../client/hooks/useThemeQuery";
import { withReactQueryGetServerSideProps } from "../../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../../server/routers/_app";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, session }) => {
    const { id: themeId, page } = query;
    if (typeof themeId !== "string") {
      return { notFound: true };
    }
    if (typeof page === "object") {
      throw new Error();
    }

    const caller = appRouter.createCaller({ session });
    const theme = await caller.theme.get({ themeId });
    if (!theme) {
      return { notFound: true };
    }

    await queryClient.prefetchQuery(themeQueryKey(themeId), () =>
      caller.theme.get({ themeId })
    );
    await queryClient.prefetchQuery(
      themeLikingUsersQueryKey(themeId, Number(page)),
      () => caller.theme.getThemeLikingUsers({ themeId, page })
    );
  }
);

const DeveloperPage: NextPage = () => {
  const router = useRouter();
  const themeId = router.query.id as string;
  const { theme } = useThemeQuery(themeId);

  if (!theme) {
    return <></>;
  }

  return <ThemeDeveloperPage theme={theme} />;
};
export default DeveloperPage;
