import { useDevQuery } from "@/client/features/dev/useDevQuery";
import { DevLikers } from "@/client/pageComponents/DevLikers/DevLikers";
import { withReactQueryGetServerSideProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { paginatedPageSchema } from "@/share/paging";
import { assertString } from "@/share/utils";
import { TRPCError } from "@trpc/server";
import { NextPage } from "next";
import { useRouter } from "next/router";
import NotFoundPage from "../../404";
import { PageLayout } from "@/client/ui/PageLayout";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ gsspContext: { query }, trpcStore }) => {
    const parsePageResult = paginatedPageSchema.safeParse(query);
    if (!parsePageResult.success) {
      console.trace("不正なクエリー");
      return { notFound: true };
    }
    const { page } = parsePageResult.data;

    const devId = assertString(query.devId);
    try {
      await trpcStore.dev.get.fetch({ devId });
    } catch (e) {
      if (e instanceof TRPCError && e.code === "NOT_FOUND") {
        return { notFound: true };
      }

      throw e;
    }

    await Promise.all([
      trpcStore.dev.get.prefetch({ devId }),
      trpcStore.user.getDevLikers.prefetch({ devId, page }),
    ]);
  }
);

const DevLikersPage: NextPage = () => {
  const router = useRouter();
  const devId = assertString(router.query.devId);
  const { dev, isLoading } = useDevQuery({ devId });

  if (isLoading) {
    return <></>;
  } else if (!dev) {
    return <NotFoundPage></NotFoundPage>;
  }

  return <DevLikers dev={dev} />;
};

export default DevLikersPage;

DevLikersPage.getLayout = (page, { isSideBarOpen }) => {
  return <PageLayout isSideBarOpen={isSideBarOpen}>{page}</PageLayout>;
};
