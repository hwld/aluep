import { NextPage } from "next";
import { useRouter } from "next/router";
import { ThemeLikelistPage } from "../../../client/components/ThemeLikelistPage";
import { themelikesQueryKey } from "../../../client/hooks/useThemeLikesQuery";
import {
  themeQueryKey,
  useThemeQuery
} from "../../../client/hooks/useThemeQuery";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/routers/_app";

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

    await queryClient.prefetchQuery(themeQueryKey(themeId), () =>
      caller.theme.get({ themeId })
    );
    await queryClient.prefetchQuery(themelikesQueryKey(themeId, Number(page)), () =>
      caller.theme.getLikedUsers({ themeId })
    );
  }
);

const ThemeLikelist: NextPage = () => {
  const router = useRouter();
  const themeId = router.query.id as string;
  const { theme } = useThemeQuery(themeId);

  if (!theme) {
    return <div>error</div>;
  }

  return <ThemeLikelistPage theme={theme} />;
};
export default ThemeLikelist;
