import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  developmentQuerykey,
  useDevelopmentQuery,
} from "../../../../../client/features/development/useDevelopmentQuery";
import { developmentLikingUsersPerPageQueryKey } from "../../../../../client/features/user/useDevelopmentLikingUsersPerPage";
import { DevelopmentLikingUsersPage } from "../../../../../client/pageComponents/DevelopmentLikingUsersPage";
import { withReactQueryGetServerSideProps } from "../../../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../../../server/router";
import { paginatedPageSchema } from "../../../../../share/schema";
import { assertString } from "../../../../../share/utils";
import NotFoundPage from "../../../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, callerContext }) => {
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

    await queryClient.prefetchQuery(developmentQuerykey(developmentId), () => {
      return caller.development.get({ developmentId });
    });
    await queryClient.prefetchQuery(
      developmentLikingUsersPerPageQueryKey(developmentId, page),
      () => {
        return caller.user.getDevelopmentLikingUsers({ developmentId, page });
      }
    );
  }
);

const DevelopmentLikingUsers: NextPage = () => {
  const router = useRouter();
  const developmentId = assertString(router.query.developmentId);
  const { development, isLoading } = useDevelopmentQuery(developmentId);

  if (isLoading) {
    return <></>;
  } else if (!development) {
    return <NotFoundPage></NotFoundPage>;
  }

  return <DevelopmentLikingUsersPage development={development} />;
};

export default DevelopmentLikingUsers;