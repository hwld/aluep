import { NextPage } from "next";
import { useRouter } from "next/router";
import { favoriteListQueryKey } from "../../../client/features/user/useFavoriteListQuery";
import { FavoriteListPage } from "../../../client/pageComponents/FavoriteListPage";

import { useUserQuery } from "../../../client/features/user/useUserQuery";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { urlParamToString } from "../../../server/lib/urlParam";
import { appRouter } from "../../../server/routers";
import { assertString } from "../../../share/utils";
import NotFoundPage from "../../404";

// TODO
export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, session, callerContext }) => {
    const caller = appRouter.createCaller(callerContext);
    const page = urlParamToString(query.page, "1");

    const userId = assertString(query.id);

    if (!session) {
      return;
    }

    // TODO: ?
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
  const userId = assertString(router.query.id);
  const { user } = useUserQuery(userId);

  if (!user) {
    return <NotFoundPage />;
  }

  return <FavoriteListPage user={user} />;
};
export default UserDetail;
