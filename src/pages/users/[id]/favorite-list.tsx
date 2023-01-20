import { NextPage } from "next";
import { useRouter } from "next/router";
import { FavoriteListPage } from "../../../client/components/UserDetail/FavoriteListPage";
import { favoriteListQueryKey } from "../../../client/hooks/useFavoriteListQuery";

import { useUserQuery } from "../../../client/hooks/useUserQuery";
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
    if (!session) {
      return;
    }

    let favoriteUserId = session.user.id;

    await queryClient.prefetchQuery(
      favoriteListQueryKey(userId, Number(page)),
      () => caller.user.favoriteList({ favoriteUserId })
    );

    favoriteUserId = userId;

    await queryClient.prefetchQuery(
      favoriteListQueryKey(favoriteUserId, Number(page)),
      () => caller.user.favoriteList({ favoriteUserId })
    );
  }
);

const UserDetail: NextPage = () => {
  const router = useRouter();
  const userId = router.query.id as string;
  const { user } = useUserQuery(userId);

  if (user) {
    return <FavoriteListPage user={user} />;
  }

  return null;
};
export default UserDetail;
