import {
  ActionIcon,
  Anchor,
  Flex,
  Stack,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { SyntheticEvent } from "react";
import { Routes } from "../../../share/routes";
import { JoinData } from "../../../share/schema";
import { AppTooltip } from "../../ui/AppTooltip";
import { ComputerIcon } from "../../ui/ComputerIcon";

type Props = {
  developments: number;
  loggedInUserJoinData: JoinData | undefined;
  onJoinTheme: (e: SyntheticEvent) => void;
  themeId: string;
};

export const ThemeJoinButton: React.FC<Props> = ({
  developments,
  loggedInUserJoinData = { joined: false },
  onJoinTheme,
  themeId,
}) => {
  const router = useRouter();
  const mantineTheme = useMantineTheme();

  const handleClick = (e: SyntheticEvent) => {
    // すでに参加している場合は自身の開発情報へ遷移させる
    if (loggedInUserJoinData.joined) {
      router.push(
        Routes.development(themeId, loggedInUserJoinData.developmentId)
      );
      return;
    }

    onJoinTheme(e);
  };

  return (
    <Stack align="center" spacing={3}>
      <Flex direction="column" justify="center" align="center" gap="5px">
        <Text color="gray.5" size="sm">
          {loggedInUserJoinData.joined ? "開発中" : "開発する"}
        </Text>
        <AppTooltip
          label={
            loggedInUserJoinData.joined
              ? "自分の開発情報を表示する"
              : "お題を開発する"
          }
          position="right"
        >
          <ActionIcon
            onClick={handleClick}
            size={60}
            sx={(theme) => ({
              display: "flex",
              flexDirection: "column",
              borderRadius: "50%",
              boxShadow: `2px 3px 6px ${theme.fn.rgba(
                theme.colors.red[7],
                0.5
              )}`,
              transition: "all 200ms",
              backgroundColor: loggedInUserJoinData.joined
                ? theme.colors.red[7]
                : theme.colors.red[7],
              "&:hover": {
                backgroundColor: theme.colors.red[6],
              },
            })}
          >
            <ComputerIcon size="70%" fill={mantineTheme.colors.gray[1]} />
          </ActionIcon>
        </AppTooltip>
      </Flex>
      <Tooltip label="開発情報の一覧を表示する" position="right">
        <Anchor
          component={Link}
          href={Routes.developments(themeId)}
          size="sm"
          sx={(theme) => ({
            pointerEvents: developments === 0 ? "none" : "auto",
            textDecoration: developments === 0 ? "none" : "underline",
            color: theme.colors.red[7],
            "&:hover": { color: theme.colors.red[7] },
          })}
        >
          {developments}
        </Anchor>
      </Tooltip>
    </Stack>
  );
};
