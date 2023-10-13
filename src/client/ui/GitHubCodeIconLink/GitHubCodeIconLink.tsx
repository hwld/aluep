import { DevCardIconLink } from "@/client/features/dev/DevCardLinkIcon/DevCardLinkIcon";
import { convertToGithubDevUrl } from "@/client/lib/convertToGithubDevUrl";
import { BsGithub } from "react-icons/bs";

type Props = { gitHubUrl: string };

/** GitHubのリポジトリをGitHub1sで開くためのボタン */
export const GitHubCodeIconLink: React.FC<Props> = ({ gitHubUrl }) => {
  return (
    <DevCardIconLink
      label="コードを見に行く"
      url={convertToGithubDevUrl(gitHubUrl)}
      icon={<BsGithub size="80%" fill="var(--mantine-color-gray-7)" />}
    />
  );
};
