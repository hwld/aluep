import { DevCardIconLink } from "@/client/features/dev/DevCardLinkIcon/DevCardLinkIcon";
import { convertToGithubDevUrl } from "@/client/lib/convertToGithubDevUrl";
import { SvgGithubMark } from "@/client/ui/Icons";

type Props = { gitHubUrl: string };

/** GitHubのリポジトリをGitHub1sで開くためのボタン */
export const GitHubCodeIconLink: React.FC<Props> = ({ gitHubUrl }) => {
  return (
    <DevCardIconLink
      label="コードを見に行く"
      url={convertToGithubDevUrl(gitHubUrl)}
      icon={
        <SvgGithubMark
          height="80%"
          width="80%"
          color="var(--mantine-color-gray-7)"
        />
      }
    />
  );
};
