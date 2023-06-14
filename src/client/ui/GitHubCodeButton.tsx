import { ActionIcon, Tooltip, useMantineTheme } from "@mantine/core";
import Link from "next/link";
import { BsGithub } from "react-icons/bs";
import { stopPropagation } from "../lib/utils";

type Props = { gitHubUrl: string };

/** GitHubのリポジトリをGitHub1sで開くためのボタン */
export const GitHubCodeButton: React.FC<Props> = ({ gitHubUrl }) => {
  const { colors } = useMantineTheme();

  return (
    <Tooltip
      label="コードを見に行く"
      position="top"
      withArrow
      transition="pop"
      onClick={stopPropagation}
    >
      <ActionIcon
        size={40}
        component={Link}
        // githubのURLをgithub1sに変換
        href={gitHubUrl.replace(/^(https:\/\/github)(.com)/, "$11s$2")}
        target="_blank"
        sx={(theme) => ({
          transition: "all 200ms",
          "&:hover": {
            backgroundColor: theme.fn.rgba(theme.colors.gray[7], 0.1),
          },
        })}
      >
        <BsGithub size="80%" fill={colors.gray[7]} />
      </ActionIcon>
    </Tooltip>
  );
};
