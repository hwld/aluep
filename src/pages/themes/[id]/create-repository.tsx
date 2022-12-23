import { NextPage } from "next";
import { useRouter } from "next/router";
import { RepoCreatePageAfterSignIn } from "../../../client/components/RepoCreatePageAfterSignIn";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import NotFoundPage from "../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ session }) => {
    if (!session) {
      return { redirect: { destination: "/", permanent: false } };
    }
  }
);

// リポジトリ作成モーダルで認証情報がなかった場合、ログイン後にここにリダイレクトされる
const CreateGitHubRepository: NextPage = () => {
  const router = useRouter();
  const { id: themeId, repoName, repoDescription } = router.query;

  if (
    typeof themeId !== "string" ||
    typeof repoName === "object" ||
    typeof repoDescription === "object"
  ) {
    return <NotFoundPage />;
  }

  return (
    <RepoCreatePageAfterSignIn
      themeId={themeId}
      repoFormData={{
        repoName: repoName ?? "",
        repoDescription: repoDescription ?? "",
      }}
    />
  );
};
export default CreateGitHubRepository;
