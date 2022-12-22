import { UserDetailPostPage } from "../../client/components/UserDetail/UserDetailPostPage";
import { joinThemesQueryKey } from "../../client/hooks/useJoinThemesQuery";
import { likeThemesQueryKey } from "../../client/hooks/useLikeThemesQuery";
import { postThemeQueryKey } from "../../client/hooks/usePostThemesQuery";
import { useSessionQuery } from "../../client/hooks/useSessionQuery";
import { sumThemeLikesQueryKey } from "../../client/hooks/useSumThemeLikesQuery";
import { themeDeveloperLikesQueryKey } from "../../client/hooks/useThemeDeveloperLikesQuery";
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

    await queryClient.prefetchQuery(postThemeQueryKey(userId), () =>
      caller.user.getPostTheme({ userId, page })
    );

    await queryClient.prefetchQuery(sumThemeLikesQueryKey, () =>
      caller.user.getThemeLike({ userId })
    );

    await queryClient.prefetchQuery(themeDeveloperLikesQueryKey, () =>
      caller.user.getThemeDeveloperLike({ userId })
    );

    await queryClient.prefetchQuery(joinThemesQueryKey(userId), () =>
      caller.user.getJoinTheme({ userId, page })
    );

    await queryClient.prefetchQuery(likeThemesQueryKey(userId), () =>
      caller.user.getLikeTheme({ userId, page })
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

  return <UserDetailPostPage user={session.user} />;
}
