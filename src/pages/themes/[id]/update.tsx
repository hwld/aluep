import { dehydrate, QueryClient } from "@tanstack/react-query";
import { NextPage } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { useRouter } from "next/router";
import { ThemeEditPage } from "../../../client/components/ThemeEditPage";
import { allTagsQueryKey } from "../../../client/hooks/useAllTagsQuery";
import {
  themeQueryKey,
  useThemeQuery,
} from "../../../client/hooks/useThemeQuery";
import { GetServerSidePropsWithReactQuery } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/routers/_app";
import { authOptions } from "../../api/auth/[...nextauth]";

export const getServerSideProps: GetServerSidePropsWithReactQuery = async ({
  req,
  res,
  query,
}) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const { id: themeId } = query;
  if (typeof themeId !== "string") {
    return { notFound: true };
  }

  const caller = appRouter.createCaller({ session });
  const theme = await caller.theme.get({ themeId });
  const allTags = await caller.theme.getAllTags();

  //　お題の作成者とログインユーザーが異なれば404にする
  if (theme.user.id !== session.user.id) {
    return { notFound: true };
  }

  const queryClient = new QueryClient();
  queryClient.setQueryData(themeQueryKey(themeId), theme);
  queryClient.setQueryData(allTagsQueryKey, allTags);
  const dehydratedState = dehydrate(queryClient);

  return {
    props: {
      dehydratedState,
    },
  };
};

const UpdateTheme: NextPage = () => {
  const router = useRouter();
  const themeId = router.query.id as string;
  const { theme } = useThemeQuery(themeId);

  if (!theme) {
    // テーマが取得できないときはサーバー側でエラーが出るから、
    // ここには到達しない？
    return <div>Error</div>;
  }

  return <ThemeEditPage theme={theme} />;
};

export default UpdateTheme;
