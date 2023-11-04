import { useDevQuery } from "@/client/features/dev/useDevQuery";
import { DevDetail } from "@/client/pageComponents/DevDetail/DevDetail";
import { withReactQueryGetServerSideProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { assertString } from "@/share/utils";
import { TRPCError } from "@trpc/server";
import { useRouter } from "next/router";
import NotFoundPage from "../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ gsspContext: { query }, trpcStore }) => {
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
      trpcStore.devMemo.getAll.prefetch({ devId }),
    ]);
  }
);

const DevDetailPage = () => {
  const router = useRouter();
  const devId = assertString(router.query.devId);
  const { dev, isLoading: loadingDev } = useDevQuery({ devId });

  if (loadingDev) {
    return <></>;
  } else if (!dev) {
    return <NotFoundPage />;
  }

  return <DevDetail dev={dev} />;
};
export default DevDetailPage;
