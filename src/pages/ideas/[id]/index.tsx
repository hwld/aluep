import { useIdeaQuery } from "@/client/features/idea/useIdeaQuery";
import { IdeaDetailPage } from "@/client/pageComponents/IdeaDetailPage/IdeaDetailPage";
import NotFoundPage from "@/pages/404";
import { withReactQueryGetServerSideProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { Routes } from "@/share/routes";
import { assertString } from "@/share/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo } from "react";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ gsspContext: { query }, session, trpcStore }) => {
    const userId = session?.user.id ?? null;
    const ideaId = assertString(query.id);

    // テーマがなければ404に飛ばす
    const idea = await trpcStore.idea.get.fetch({ ideaId: ideaId });
    if (!idea) {
      console.trace("指定されたお題が存在しない");
      return { notFound: true };
    }

    await Promise.all([
      trpcStore.idea.get.prefetch({ ideaId }),
      trpcStore.idea.isLikedByUser.prefetch({ ideaId, userId }),
      trpcStore.development.isDevelopedByUser.prefetch({ ideaId, userId }),
      trpcStore.ideaComment.getAll.prefetch({ ideaId }),
    ]);
  }
);

const IdeaDetail = () => {
  const router = useRouter();
  const ideaId = assertString(router.query.id);
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
      <IdeaDetailPage idea={idea} />
    </>
  );
};
export default IdeaDetail;
