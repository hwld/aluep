import { UserDetailLikePage } from "../../../client/components/UserDetail/UserDetailLikePage";
import { likeThemesQueryKey } from "../../../client/hooks/useLikeThemesQuery";
import { useSessionQuery } from "../../../client/hooks/useSessionQuery";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/routers/_app";

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

  return <UserDetailLikePage user={session.user} />;
}
