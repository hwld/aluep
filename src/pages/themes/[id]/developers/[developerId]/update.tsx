import { NextPage } from "next";
import { useRouter } from "next/router";
import { DeveloperEditPage } from "../../../../../client/components/DeveloperEditPage";
import {
  developerQuerykey,
  useDeveloperQuery,
} from "../../../../../client/hooks/useDeveloperQuery";
import {
  themeQueryKey,
  useThemeQuery,
} from "../../../../../client/hooks/useThemeQuery";
import { withReactQueryGetServerSideProps } from "../../../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../../../server/routers/_app";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, session }) => {
    if (!session) {
      return { redirect: { destination: "/", permanent: false } };
    }

    const { id: themeId, developerId } = query;
    if (typeof themeId !== "string" || typeof developerId !== "string") {
      return { notFound: true };
    }

    const caller = appRouter.createCaller({ session });
    const developer = await caller.themeDeveloper.get({ developerId });

    // 開発者とログインユーザーが異なれば404にする
    if (developer?.userId !== session.user.id) {
      return { notFound: true };
    }

    await queryClient.prefetchQuery(themeQueryKey(themeId), () =>
      caller.theme.get({ themeId })
    );
    await queryClient.prefetchQuery(
      developerQuerykey(developerId),
      () => developer
    );
  }
);

const DeveloperUpdate: NextPage = () => {
  const router = useRouter();
  const themeId = router.query.id as string;
  const developerId = router.query.developerId as string;

  const { theme } = useThemeQuery(themeId);
  const { developer } = useDeveloperQuery(developerId);

  // テーマが取得できないときはサーバーでエラーが出るから
  // ここには到達しない
  if (!theme || !developer) {
    return <div>Error</div>;
  }

  return <DeveloperEditPage theme={theme} developer={developer} />;
};
export default DeveloperUpdate;
