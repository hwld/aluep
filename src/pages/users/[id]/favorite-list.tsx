import { NextPage } from "next";
import { useRouter } from "next/router";
import { favoritedUsersQueryKey } from "../../../client/features/user/useFavoriteListQuery";
import { FavoriteListPage } from "../../../client/pageComponents/FavoriteListPage";

import {
  userQueryKey,
  useUserQuery,
} from "../../../client/features/user/useUserQuery";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { urlParamToString } from "../../../server/lib/urlParam";
import { appRouter } from "../../../server/routers";
import { assertString } from "../../../share/utils";
import NotFoundPage from "../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, callerContext }) => {
    const caller = appRouter.createCaller(callerContext);

    const page = urlParamToString(query.page, "1");
    const userId = assertString(query.id);

    const user = caller.user.get({ userId });
    if (!user) {
      return { notFound: true };
    }

    await queryClient.prefetchQuery(
      favoritedUsersQueryKey(userId, Number(page)),
      () => caller.user.favoritedUsers({ favoriteByUserId: userId })
    );

    await queryClient.prefetchQuery(userQueryKey(userId), () => user);
  }
);

const UserDetail: NextPage = () => {
  const router = useRouter();
  const userId = assertString(router.query.id);
  const { user, isLoading } = useUserQuery(userId);

  if (isLoading) {
    return <></>;
  } else if (!user) {
    return <NotFoundPage />;
  }

  return <FavoriteListPage user={user} />;
};
export default UserDetail;
