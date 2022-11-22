import { dehydrate, QueryClient } from "@tanstack/react-query";
import { unstable_getServerSession } from "next-auth/next";
import { ThemeCreatePage } from "../../client/components/ThemeCreatePage";
import { allTagsQueryKey } from "../../client/hooks/useAllTagsQuery";
import { sessionQuerykey } from "../../client/hooks/useSessionQuery";
import { GetServerSidePropsWithReactQuery } from "../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../server/routers/_app";
import { authOptions } from "../api/auth/[...nextauth]";

export const getServerSideProps: GetServerSidePropsWithReactQuery = async ({
  req,
  res,
}) => {
  const caller = appRouter.createCaller({ session: null });

  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const allTags = caller.theme.getAllTags();

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(sessionQuerykey, () => session);
  await queryClient.prefetchQuery(allTagsQueryKey, () => allTags);
  const dehydratedState = dehydrate(queryClient);

  return {
    props: {
      dehydratedState,
    },
  };
};

export default function CreateTheme() {
  return <ThemeCreatePage />;
}
