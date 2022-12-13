import { useRouter } from "next/router";
import { ThemeDetailPage } from "../../../client/components/ThemeDetailPage";
import { themeDevelopersQueryKey } from "../../../client/hooks/useThemeDevelopersQuery";
import { themeJoinQueryKey } from "../../../client/hooks/useThemeJoinedQuery";
import { themeLikedQueryKey } from "../../../client/hooks/useThemeLike";
import {
  themeQueryKey,
  useThemeQuery,
} from "../../../client/hooks/useThemeQuery";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/routers/_app";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, session }) => {
    const { id: themeId } = query;
    if (typeof themeId !== "string") {
      return { notFound: true };
    }

    const caller = appRouter.createCaller({ session });

    await queryClient.prefetchQuery(themeQueryKey(themeId), () =>
      caller.theme.get({ themeId })
    );
    await queryClient.prefetchQuery(
      themeLikedQueryKey(themeId, session?.user.id),
      () => caller.theme.liked({ themeId })
    );
    await queryClient.prefetchQuery(
      themeJoinQueryKey(themeId, session?.user.id),
      () => caller.theme.joined({ themeId })
    );
    await queryClient.prefetchQuery(themeDevelopersQueryKey(themeId), () =>
      caller.theme.getAllDevelopers({ themeId })
    );
  }
);

export const ThemeDetail = () => {
  const router = useRouter();
  const themeId = router.query.id as string;
  const { theme } = useThemeQuery(themeId);

  if (!theme) {
    return <div>Error</div>;
  }

  return <ThemeDetailPage theme={theme} />;
};
export default ThemeDetail;