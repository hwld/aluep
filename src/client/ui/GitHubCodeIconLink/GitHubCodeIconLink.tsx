import { convertToGithubDevUrl } from "@/client/lib/convertToGithubDevUrl";
import { CardActionLinkButton } from "@/client/ui/CardActionButton/CardActionButton";
import { IconBrandGithub } from "@tabler/icons-react";

type Props = { gitHubUrl: string };

/** GitHubのリポジトリをGitHub1sで開くためのボタン */
export const GitHubCodeIconLink: React.FC<Props> = ({ gitHubUrl }) => {
  return (
    <CardActionLinkButton
      label="コードを見に行く"
      url={convertToGithubDevUrl(gitHubUrl)}
      icon={<IconBrandGithub color="var(--mantine-color-gray-7)" />}
    />
  );
};
