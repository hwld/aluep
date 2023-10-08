import { useDevQuery } from "@/client/features/dev/useDevQuery";
import { DevelopmentLikersPage } from "@/client/pageComponents/DevelopmentLikersPage/DevelopmentLikersPage";
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
      return { notFound: true };
    }
    const { page } = parsePageResult.data;

    const developmentId = assertString(query.developmentId);
    const development = await trpcStore.development.get.fetch({
      developmentId,
    });
    if (!development) {
      return { notFound: true };
    }

    await Promise.all([
      trpcStore.development.get.prefetch({ developmentId }),
      trpcStore.user.getDevelopmentLikers.prefetch({ developmentId, page }),
    ]);
  }
);

const DevelopmentLikers: NextPage = () => {
  const router = useRouter();
  const developmentId = assertString(router.query.developmentId);
  const { development, isLoading } = useDevQuery({ developmentId });

  if (isLoading) {
    return <></>;
  } else if (!development) {
    return <NotFoundPage></NotFoundPage>;
  }

  return <DevelopmentLikersPage development={development} />;
};

export default DevelopmentLikers;
