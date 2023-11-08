import { useRequireLoginModal } from "@/client/features/session/RequireLoginModalProvider";
import { useSessionQuery } from "@/client/features/session/useSessionQuery";
import { AppTooltip } from "@/client/ui/AppTooltip";
import { ComputerIcon } from "@/client/ui/ComputerIcon";
import { MutedText } from "@/client/ui/MutedText/MutedText";
import { Routes } from "@/share/routes";
import { ActionIcon, Anchor, Flex, Stack, Tooltip } from "@mantine/core";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import classes from "./DevelopButton.module.css";

type Props = {
  devs: number;
  loggedInUserDevId?: string | undefined;
  ideaId: string;
};

export const DevelopButton: React.FC<Props> = ({
  devs,
  loggedInUserDevId,
  ideaId,
}) => {
  const { session } = useSessionQuery();
  const { openLoginModal } = useRequireLoginModal();
  const router = useRouter();

  const handleClick = () => {
    // ログインしていなければログインモーダルを表示する
    if (!session) {
      openLoginModal(Routes.develop(ideaId));
      return;
    }

    // すでに開発している場合は自身の開発情報へ遷移させる
    if (loggedInUserDevId) {
      router.push(Routes.dev(loggedInUserDevId));
      return;
    }

    router.push(Routes.develop(ideaId));
  };

  return (
    <Stack align="center" gap={3}>
      <Flex direction="column" justify="center" align="center" gap="5px">
        <MutedText>{loggedInUserDevId ? "開発中" : "開発する"}</MutedText>
        <AppTooltip
          label={
            loggedInUserDevId ? "自分の開発情報を表示する" : "お題を開発する"
          }
          position="right"
        >
          <ActionIcon
            onClick={handleClick}
            size={60}
            className={classes.button}
          >
            <ComputerIcon size="70%" fill="var(--mantine-color-gray-1)" />
          </ActionIcon>
        </AppTooltip>
      </Flex>
      <Tooltip offset={10} label="開発情報の一覧を表示する" position="right">
        <Anchor
          component={Link}
          href={Routes.devs(ideaId)}
          size="sm"
          className={clsx(classes["developer-count"], {
            [classes.link]: devs > 0,
          })}
        >
          {devs}
        </Anchor>
      </Tooltip>
    </Stack>
  );
};
