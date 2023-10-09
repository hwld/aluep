import { DevCardIconLink } from "@/client/features/dev/DevCardLinkIcon/DevCardLinkIcon";
import { BsGithub } from "react-icons/bs";

type Props = { gitHubUrl: string };

/** GitHubのリポジトリをGitHub1sで開くためのボタン */
export const GitHubCodeIconLink: React.FC<Props> = ({ gitHubUrl }) => {
  return (
    <DevCardIconLink
      label="コードを見に行く"
      url={gitHubUrl.replace(/^(https:\/\/github)(.com)/, "$11s$2")}
      icon={<BsGithub size="80%" fill="var(--mantine-color-gray-7)" />}
    />
  );
};
