import { useRouter } from "next/router";
import { UserDetailAnotherLikePage } from "../../../client/components/UserDetailAnother/UserDetailAnotherLikePage";
import { likeThemesQueryKey } from "../../../client/hooks/useLikeThemesQuery";
import { userQueryKey, useUserQuery } from "../../../client/hooks/useUserQuery";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/routers/_app";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, session }) => {
    const caller = appRouter.createCaller({ session });
    const { page } = query;

    const { id: userId } = query;

    if (typeof userId !== "string") {
      return;
    }
    if (typeof page === "object") {
      throw new Error();
    }

    await queryClient.prefetchQuery(userQueryKey(userId), () =>
      caller.user.get({ userId })
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
    return <UserDetailAnotherLikePage user={user} />;
  }
}
export default UserDetail;
