import { userKeys } from "@/client/features/user/queryKeys";
import { useUserQuery } from "@/client/features/user/useUserQuery";
import { FavoritedUsersPage } from "@/client/pageComponents/FavoritedUsersPage/FavoritedUsersPage";
import { withReactQueryGetServerSideProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "@/server/router";
import { paginatedPageSchema } from "@/share/paging";
import { assertString } from "@/share/utils";
import { NextPage } from "next";
import { useRouter } from "next/router";
import NotFoundPage from "../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ gsspContext: { query }, queryClient, callerContext }) => {
    const caller = appRouter.createCaller(callerContext);

    const parsePageObjResult = paginatedPageSchema.safeParse(query);
    if (!parsePageObjResult.success) {
      return { notFound: true };
    }
    const { page } = parsePageObjResult.data;

    const userId = assertString(query.id);
    const user = caller.user.get({ userId });
    if (!user) {
      return { notFound: true };
    }

    await queryClient.prefetchQuery(userKeys.favoritedList(userId, page), () =>
      caller.user.getFavoritedUsers({
        favoriteByUserId: userId,
        page,
      })
    );

    await queryClient.prefetchQuery(userKeys.detail(userId), () => user);
  }
);

const UserDetail: NextPage = () => {
  const router = useRouter();
  const userId = assertString(router.query.id);
  const { user, isLoading } = useUserQuery({ userId });

  if (isLoading) {
    return <></>;
  } else if (!user) {
    return <NotFoundPage />;
  }

  return <FavoritedUsersPage user={user} />;
};
export default UserDetail;
