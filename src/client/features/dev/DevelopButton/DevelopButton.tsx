import { AppTooltip } from "@/client/ui/AppTooltip";
import { ComputerIcon } from "@/client/ui/ComputerIcon";
import { DevelopedData } from "@/models/development";
import { Routes } from "@/share/routes";
import {
  ActionIcon,
  Anchor,
  Flex,
  Stack,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { SyntheticEvent } from "react";
import classes from "./DevelopButton.module.css";

type Props = {
  developments: number;
  loggedInUserDevelopedData: DevelopedData | undefined;
  onDevelopIdea: (e: SyntheticEvent) => void;
  ideaId: string;
};

export const DevelopButton: React.FC<Props> = ({
  developments,
  loggedInUserDevelopedData = { developed: false },
  onDevelopIdea,
  ideaId,
}) => {
  const router = useRouter();
  const mantineTheme = useMantineTheme();

  const handleClick = (e: SyntheticEvent) => {
    // すでに開発している場合は自身の開発情報へ遷移させる
    if (loggedInUserDevelopedData.developed) {
      router.push(
        Routes.development(ideaId, loggedInUserDevelopedData.developmentId)
      );
      return;
    }

    onDevelopIdea(e);
  };

  return (
    <Stack align="center" gap={3}>
      <Flex direction="column" justify="center" align="center" gap="5px">
        <Text c="gray.5" size="sm">
          {loggedInUserDevelopedData.developed ? "開発中" : "開発する"}
        </Text>
        <AppTooltip
          label={
            loggedInUserDevelopedData.developed
              ? "自分の開発情報を表示する"
              : "お題を開発する"
          }
          position="right"
        >
          <ActionIcon
            onClick={handleClick}
            size={60}
            className={classes.button}
          >
            <ComputerIcon size="70%" fill={mantineTheme.colors.gray[1]} />
          </ActionIcon>
        </AppTooltip>
      </Flex>
      <Tooltip offset={10} label="開発情報の一覧を表示する" position="right">
        <Anchor
          component={Link}
          href={Routes.developments(ideaId)}
          size="sm"
          className={clsx(classes["developer-count"], {
            [classes.link]: developments > 0,
          })}
        >
          {developments}
        </Anchor>
      </Tooltip>
    </Stack>
  );
};
