import { useRouter } from "next/router";
import { UserDetailAnotherPostPage } from "../../../client/components/UserDetailAnother/UserDetailAnotherPostPage";
import { joinThemesQueryKey } from "../../../client/hooks/useJoinThemesQuery";
import { likeThemesQueryKey } from "../../../client/hooks/useLikeThemesQuery";
import { postThemeQueryKey } from "../../../client/hooks/usePostThemesQuery";
import { sumThemeLikesQueryKey } from "../../../client/hooks/useSumThemeLikesQuery";
import { themeDeveloperLikesQueryKey } from "../../../client/hooks/useThemeDeveloperLikesQuery";
import { userQueryKey, useUserQuery } from "../../../client/hooks/useUserQuery";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/routers/_app";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, session }) => {
    const caller = appRouter.createCaller({ session });
    const { page } = query;

    const { id: userId } = query;

    if (typeof userId !== "string") {
      return { notFound: true };
    }
    if (typeof page === "object") {
      throw new Error();
    }
    const user = await caller.user.get({ userId });
    if (!user) {
      return { notFound: true };
    }

    queryClient.setQueryData(userQueryKey(userId), user);

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
  }
);

export function UserDetail() {
  const router = useRouter();
  const userId = router.query.id as string;
  const { user } = useUserQuery(userId);

  if (user == undefined) {
    return;
  } else {
    //TODO
    return <UserDetailAnotherPostPage user={user} />;
  }
}
export default UserDetail;
