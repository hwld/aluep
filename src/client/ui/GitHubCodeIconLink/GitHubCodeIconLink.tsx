import { DevCardIconLink } from "@/client/features/dev/DevCardLinkIcon/DevCardLinkIcon";
import { useMantineTheme } from "@mantine/core";
import { BsGithub } from "react-icons/bs";

type Props = { gitHubUrl: string };

/** GitHubのリポジトリをGitHub1sで開くためのボタン */
export const GitHubCodeIconLink: React.FC<Props> = ({ gitHubUrl }) => {
  const { colors } = useMantineTheme();

  return (
    <DevCardIconLink
      label="コードを見に行く"
      url={gitHubUrl.replace(/^(https:\/\/github)(.com)/, "$11s$2")}
      icon={<BsGithub size="80%" fill={colors.gray[7]} />}
    />
  );
};
