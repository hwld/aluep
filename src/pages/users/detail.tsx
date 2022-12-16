import { UserDetailPage } from "../../client/components/UserDetailPage";
import { joinThemesQueryKey } from "../../client/hooks/useJoinThemesQuery";
import { likeThemesQueryKey } from "../../client/hooks/useLikeThemesQuery";
import { postThemeQueryKey } from "../../client/hooks/usePostThemesQuery";
import { useSessionQuery } from "../../client/hooks/useSessionQuery";
import { themeDeveloperLikesQueryKey } from "../../client/hooks/useThemeDeveloperLikesQuery";
import { themeLikesForUserQueryKey } from "../../client/hooks/useThemeLikesForUserQuery";
import { withReactQueryGetServerSideProps } from "../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../server/routers/_app";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, session }) => {
    const caller = appRouter.createCaller({ session });

    const userId = session?.user.id;

    const { page } = query;

    if (typeof page === "object") {
      throw new Error();
    }
    if (typeof userId !== "string") {
      return;
    }

    await queryClient.prefetchQuery(postThemeQueryKey, () =>
      caller.user.getPostTheme({ userId })
    );

    await queryClient.prefetchQuery(themeLikesForUserQueryKey(userId), () =>
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

    if (!session) {
      return { redirect: { destination: "/", permanent: false } };
    }
  }
);

export default function Detail() {
  const { session } = useSessionQuery();

  if (session?.user.id === undefined) {
    return <div>error</div>;
  }

  return <UserDetailPage user={session.user} />;
}
