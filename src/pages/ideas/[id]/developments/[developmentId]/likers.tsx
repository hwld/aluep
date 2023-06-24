import { developmentKeys } from "@/client/features/development/queryKeys";
import { useDevelopmentQuery } from "@/client/features/development/useDevelopmentQuery";
import { userKeys } from "@/client/features/user/queryKeys";
import { DevelopmentLikersPage } from "@/client/pageComponents/DevelopmentLikersPage";
import { withReactQueryGetServerSideProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "@/server/router";
import { paginatedPageSchema } from "@/share/schema/util";
import { assertString } from "@/share/utils";
import { NextPage } from "next";
import { useRouter } from "next/router";
import NotFoundPage from "../../../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ gsspContext: { query }, queryClient, callerContext }) => {
    const parsePageResult = paginatedPageSchema.safeParse(query);
    if (!parsePageResult.success) {
      return { notFound: true };
    }
    const { page } = parsePageResult.data;
    const developmentId = assertString(query.developmentId);
    const caller = appRouter.createCaller(callerContext);
    const development = await caller.development.get({ developmentId });
    if (!development) {
      return { notFound: true };
    }

    await queryClient.prefetchQuery(
      developmentKeys.detail(developmentId),
      () => {
        return caller.development.get({ developmentId });
      }
    );
    await queryClient.prefetchQuery(
      userKeys.developmentLikers(developmentId, page),
      () => {
        return caller.user.getDevelopmentLikers({ developmentId, page });
      }
    );
  }
);

const DevelopmentLikers: NextPage = () => {
  const router = useRouter();
  const developmentId = assertString(router.query.developmentId);
  const { development, isLoading } = useDevelopmentQuery({ developmentId });

  if (isLoading) {
    return <></>;
  } else if (!development) {
    return <NotFoundPage></NotFoundPage>;
  }

  return <DevelopmentLikersPage development={development} />;
};

export default DevelopmentLikers;
