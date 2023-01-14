import { useRouter } from "next/router";
import { ThemeDetailPage } from "../../../client/components/ThemeDetailPage";
import { paginatedDevelopersQueryKey } from "../../../client/hooks/usePaginatedDeveloperQueery";
import { themeJoinQueryKey } from "../../../client/hooks/useThemeJoin";
import { themeLikedQueryKey } from "../../../client/hooks/useThemeLike";
import {
  themeQueryKey,
  useThemeQuery,
} from "../../../client/hooks/useThemeQuery";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/routers/_app";
import NotFoundPage from "../../404";

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

    // テーマがなければ404に飛ばす
    const theme = await caller.theme.get({ themeId });
    if (!theme) {
      return { notFound: true };
    }

    const paginatedDevelopers = await caller.theme.getDeveloperAllpage({
      themeId,
      page,
    });
    // ページが指定されているが、開発者が取得できなかった場合404を返す
    if (page !== undefined && paginatedDevelopers.developers.length === 0) {
      return { notFound: true };
    }

    queryClient.setQueryData(themeQueryKey(themeId), theme);
    queryClient.setQueryData(
      paginatedDevelopersQueryKey(themeId, Number(page)),
      paginatedDevelopers
    );
    await queryClient.prefetchQuery(
      themeLikedQueryKey(themeId, session?.user.id),
      () => caller.theme.liked({ themeId })
    );
    await queryClient.prefetchQuery(
      themeJoinQueryKey(themeId, session?.user.id),
      () => caller.theme.joined({ themeId })
    );
  }
);

export const ThemeDetail = () => {
  const router = useRouter();
  const themeId = router.query.id as string;
  const { theme } = useThemeQuery(themeId);

  if (!theme) {
    return <NotFoundPage />;
  }

  return <ThemeDetailPage theme={theme} />;
};
export default ThemeDetail;
