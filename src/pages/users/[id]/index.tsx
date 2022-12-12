import { useRouter } from "next/router";
import { UserDetailAnotherPage } from "../../../client/components/UserDetailAnotherPage";
import { useThemeQuery } from "../../../client/hooks/useThemeQuery";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, session }) => {
    const { id: themeId } = query;
    if (typeof themeId !== "string") {
      return { notFound: true };
    }
  }
);

export function UserDetail() {
  const router = useRouter();
  const userId = router.query.id as string;
  const { theme } = useThemeQuery(userId);

  if (!theme) {
    return <div>Erroraaaaaaaaaaaaaaaaaaaa</div>;
  }

  return <UserDetailAnotherPage user={theme} />;
}
export default UserDetail;
