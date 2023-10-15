import { useDevQuery } from "@/client/features/dev/useDevQuery";
import { DevLikersPage } from "@/client/pageComponents/DevLikersPage/DevLikersPage";
import { withReactQueryGetServerSideProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { paginatedPageSchema } from "@/share/paging";
import { assertString } from "@/share/utils";
import { NextPage } from "next";
import { useRouter } from "next/router";
import NotFoundPage from "../../../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ gsspContext: { query }, trpcStore }) => {
    const parsePageResult = paginatedPageSchema.safeParse(query);
    if (!parsePageResult.success) {
      console.trace("不正なクエリー");
      return { notFound: true };
    }
    const { page } = parsePageResult.data;

    const devId = assertString(query.devId);
    const dev = await trpcStore.dev.get.fetch({ devId });
    if (!dev) {
      console.trace("指定された開発情報が存在しない");
      return { notFound: true };
    }

    await Promise.all([
      trpcStore.dev.get.prefetch({ devId }),
      trpcStore.user.getDevLikers.prefetch({ devId, page }),
    ]);
  }
);

const DevLikers: NextPage = () => {
  const router = useRouter();
  const devId = assertString(router.query.devId);
  const { dev, isLoading } = useDevQuery({ devId });

  if (isLoading) {
    return <></>;
  } else if (!dev) {
    return <NotFoundPage></NotFoundPage>;
  }

  return <DevLikersPage dev={dev} />;
};

export default DevLikers;
