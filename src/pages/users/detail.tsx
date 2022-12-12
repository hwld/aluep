import { UserDetailPage } from "../../client/components/UserDetailPage";
import { postThemeQueryKey } from "../../client/hooks/usePostThemesQuery";
import { useSessionQuery } from "../../client/hooks/useSessionQuery";
import { withReactQueryGetServerSideProps } from "../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../server/routers/_app";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, session }) => {
    const caller = appRouter.createCaller({ session });
    const { page } = query;

    await queryClient.prefetchQuery(
      postThemeQueryKey,
      () => caller.user.getPostTheme
    );

    if (!session) {
      return { redirect: { destination: "/", permanent: false } };
    }
  }
);
// const caller = appRouter.createCaller({ session });

// const { page } = query;
// if (typeof page === "object") {
//   throw new Error();
// }

// await queryClient.prefetchQuery(paginatedThemesQueryKey(Number(page)), () =>
//   caller.theme.getMany({ page })
// );
// await queryClient.prefetchQuery(top10LikesThemesInThisMonthQueryKey, () =>
//   caller.theme.getTop10LikesThemesInThisMonth()
// );
// await queryClient.prefetchQuery(
//   top10LikesDevelopersInThisMonthQueryKey,
//   () => caller.theme.getTop10LikesDevelopersInThisMonth()
// );
// await queryClient.prefetchQuery(top10LikesPostersInThisMonthQueryKey, () =>
//   caller.theme.getTop10LikesPostersInThisMonth()
// );
// }

export default function Detail() {
  const { session } = useSessionQuery();

  if (session?.user.id === undefined) {
    return <div>error</div>;
  }

  return <UserDetailPage user={session.user} />;
}
