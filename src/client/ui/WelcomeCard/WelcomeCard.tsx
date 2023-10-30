import { SvgArrowRight, SvgX } from "@/client/ui/Icons";
import { Routes } from "@/share/routes";
import {
  ActionIcon,
  Button,
  Group,
  GroupProps,
  Stack,
  Text,
} from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import classes from "./WelcomeCard.module.css";

type Props = { onClose: () => void } & GroupProps;

export const WelcomeCard: React.FC<Props> = ({ onClose, ...props }) => {
  return (
    <Group
      {...props}
      className={classes.root}
      style={{
        position: "relative",
        borderRadius: "var(--mantine-spacing-md)",
        overflow: "hidden",
      }}
      bg="gray.8"
      justify="flex-start"
    >
      <ActionIcon
        className={classes["close-button"]}
        size={40}
        onClick={onClose}
      >
        <SvgX width="100%" height="100%" />
      </ActionIcon>
      <Stack style={{ zIndex: 10 }} gap="xl">
        <Stack gap="xs">
          <Text c="gray.2" fz={30} fw="bold">
            <Text span c="gray.1" fz={40} fw="bold" mr="xs">
              Aluep
            </Text>
            へようこそ！
          </Text>
          <Text c="gray.2" fz="sm">
            Aluepは、アプリのアイデアを「お題」として
            <br />
            投稿・検索できるWebアプリです
          </Text>
        </Stack>
        <Button
          component={Link}
          href={Routes.about}
          className={classes["more-button"]}
          rightSection={<SvgArrowRight width={20} height={20} />}
        >
          このアプリについて
        </Button>
      </Stack>
      <Group>
        <Image
          src="/app-logo.svg"
          style={{
            position: "absolute",
            right: 500,
            top: -30,
            opacity: 0.7,
            pointerEvents: "none",
          }}
          width={150}
          height={150}
          alt="app logo"
        />
        <Image
          src="/app-logo.svg"
          style={{
            position: "absolute",
            right: 200,
            top: 20,
            opacity: 0.7,
            pointerEvents: "none",
          }}
          width={350}
          height={350}
          alt="app logo"
        />
        <Image
          src="/app-logo.svg"
          style={{
            position: "absolute",
            right: 30,
            top: 0,
            opacity: 0.7,
            pointerEvents: "none",
          }}
          width={200}
          height={200}
          alt="app logo"
        />
      </Group>
    </Group>
  );
};
