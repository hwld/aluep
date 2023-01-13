import { NextPage } from "next";
import { useRouter } from "next/router";
import { FavoriteListPage } from "../../../client/components/UserDetail/FavoriteListPage";

import {
  favoriteListQueryKey,
  useFavoriteListQuery,
} from "../../../client/hooks/useFavoriteListQuery";
import { useSessionQuery } from "../../../client/hooks/useSessionQuery";
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
    if (session) {
      const favoriteUserId = session.user.id;

      await queryClient.prefetchQuery(favoriteListQueryKey(userId), () =>
        caller.user.favoriteList({ favoriteUserId })
      );
    } else {
      //自分のページじゃないとき
    }
  }
);

/**
 *  ユーザーの詳細ページ
 *  ユーザーが参加したお題一覧を表示する
 */
const UserDetail: NextPage = () => {
  const router = useRouter();
  const userId = router.query.id as string;
  const { user } = useUserQuery(userId);
  const { session } = useSessionQuery();

  if (session) {
    const { favoriteList } = useFavoriteListQuery(session.user.id);
    return <FavoriteListPage />;
  }

  if (user === undefined) {
    return null;
  } else {
    return null;
  }
};
export default UserDetail;
