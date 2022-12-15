import { useRouter } from "next/router";
import { UserDetailAnotherPage } from "../../../client/components/UserDetailAnotherPage";
import { joinThemesQueryKey } from "../../../client/hooks/useJoinThemesQuery";
import { likeThemesQueryKey } from "../../../client/hooks/useLikeThemesQuery";
import { postThemeQueryKey } from "../../../client/hooks/usePostThemesQuery";
import { themeDeveloperLikesQueryKey } from "../../../client/hooks/useThemeDeveloperLikesQuery";
import { themeLikesQueryKey } from "../../../client/hooks/useThemeLikesQuery";
import { userQueryKey, useUserQuery } from "../../../client/hooks/useUserQuery";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/routers/_app";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, session }) => {
    const caller = appRouter.createCaller({ session });
    const { id: userId } = query;
    if (typeof userId !== "string") {
      return;
    }

    await queryClient.prefetchQuery(userQueryKey(userId), () =>
      caller.user.get({ userId })
    );

    await queryClient.prefetchQuery(postThemeQueryKey, () =>
      caller.user.getPostTheme({ userId })
    );

    await queryClient.prefetchQuery(themeLikesQueryKey, () =>
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

export function UserDetail() {
  const router = useRouter();
  const userId = router.query.id as string;
  console.log(userId);
  const { user } = useUserQuery(userId);

  console.log(user);

  if (user == undefined) {
    return;
  } else {
    //TODO
    return <UserDetailAnotherPage user={user} />;
  }
}
export default UserDetail;
