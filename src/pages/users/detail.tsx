import { UserDetailPage } from "../../client/components/UserDetailPage";
import { joinThemesQueryKey } from "../../client/hooks/useJoinThemesQuery";
import { likeThemesQueryKey } from "../../client/hooks/useLikeThemesQuery";
import { postThemeQueryKey } from "../../client/hooks/usePostThemesQuery";
import { useSessionQuery } from "../../client/hooks/useSessionQuery";
import { sumThemeLikesQueryKey } from "../../client/hooks/useSumThemeLikesQuery";
import { themeDeveloperLikesQueryKey } from "../../client/hooks/useThemeDeveloperLikesQuery";
import { withReactQueryGetServerSideProps } from "../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../server/routers/_app";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ queryClient, session }) => {
    if (!session) {
      return { redirect: { destination: "/", permanent: false } };
    }

    const userId = session.user.id;

    const caller = appRouter.createCaller({ session });

    await queryClient.prefetchQuery(postThemeQueryKey, () =>
      caller.user.getPostTheme({ userId })
    );

    await queryClient.prefetchQuery(sumThemeLikesQueryKey, () =>
      caller.user.getThemeLike({ userId })
    );

    await queryClient.prefetchQuery(themeDeveloperLikesQueryKey, () =>
      caller.user.getThemeDeveloperLike({ userId })
    );

    await queryClient.prefetchQuery(joinThemesQueryKey, () =>
      caller.user.getJoinTheme({ userId })
    );

    await queryClient.prefetchQuery(likeThemesQueryKey, () =>
      caller.user.getLikeTheme({ userId })
    );
  }
);

export default function Detail() {
  const { session } = useSessionQuery();

  if (session?.user.id === undefined) {
    return <div>error</div>;
  }

  return <UserDetailPage user={session.user} />;
}
