import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { resolvedUrl } }) => {
    return {
      redirect: {
        destination: `${resolvedUrl}/posted-themes`,
        permanent: true,
      },
    };
  }
);

/**
 *  ユーザーの詳細ページ
 *  リダイレクトするのでここには到達しない
 */
export function UserDetail() {
  return null;
}
export default UserDetail;
