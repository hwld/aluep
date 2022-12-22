import { useRouter } from "next/router";
import { UserDetailAnotherJoinPage } from "../../../client/components/UserDetailAnother/UserDetailAnotherJoinPage";
import { joinThemesQueryKey } from "../../../client/hooks/useJoinThemesQuery";
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

    await queryClient.prefetchQuery(joinThemesQueryKey(userId), () =>
      caller.user.getJoinTheme({ userId, page })
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
    return <UserDetailAnotherJoinPage user={user} />;
  }
}
export default UserDetail;
