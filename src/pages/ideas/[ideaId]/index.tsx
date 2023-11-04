import { useIdeaQuery } from "@/client/features/idea/useIdeaQuery";
import { IdeaDetail } from "@/client/pageComponents/IdeaDetail/IdeaDetail";
import NotFoundPage from "@/pages/404";
import { withReactQueryGetServerSideProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { Routes } from "@/share/routes";
import { assertString } from "@/share/utils";
import { TRPCError } from "@trpc/server";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo } from "react";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ gsspContext: { query }, trpcStore }) => {
    const ideaId = assertString(query.ideaId);

    // テーマがなければ404に飛ばす
    try {
      await trpcStore.idea.get.fetch({ ideaId });
    } catch (e) {
      if (e instanceof TRPCError && e.code === "NOT_FOUND") {
        return { notFound: true };
      }

      throw e;
    }

    await Promise.all([
      trpcStore.idea.get.prefetch({ ideaId }),
      trpcStore.ideaComment.getAll.prefetch({ ideaId }),
    ]);
  }
);

const IdeaDetailPage = () => {
  const router = useRouter();
  const ideaId = assertString(router.query.ideaId);
  const { idea, isLoading } = useIdeaQuery({ ideaId });
  const ogUrl = useMemo(() => {
    if (!idea) {
      return "";
    }

    const url = new URL(`${process.env.NEXT_PUBLIC_URL}/api/og`);
    url.searchParams.append("title", idea.title);
    url.searchParams.append("userName", idea.user.name ?? "");
    if (idea.user.image !== null) {
      url.searchParams.append("userImage", idea.user.image);
    }

    return url;
  }, [idea]);

  if (isLoading) {
    return <></>;
  } else if (!idea) {
    return <NotFoundPage />;
  }

  return (
    <>
      <Head>
        <title>{idea.title}</title>
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_URL}${Routes.idea(idea.id)}`}
        />
        <meta property="og:title" content={idea.title} />
        <meta property="og:image" content={`${ogUrl.toString()}`} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Aluep" />
        <meta property="og:locale" content="ja_JP" />
      </Head>
      <IdeaDetail idea={idea} />
    </>
  );
};
export default IdeaDetailPage;
