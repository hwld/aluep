import { Button, Flex, Stack, Title } from "@mantine/core";
import Link from "next/link";
import { ReactNode } from "react";
import { HiArrowRight } from "react-icons/hi";
import { Theme } from "../../server/models/theme";
import { useSessionQuery } from "../hooks/useSessionQuery";
import { NothingTheme } from "./NothingTheme";
import { ThemeCardContainer } from "./ThemeCardContainer";

type Props = {
  title: string;
  themes: Theme[];
  readMoreHref: string;
  icon?: ReactNode;
};

export const PickedUpThemes: React.FC<Props> = ({
  title,
  themes,
  readMoreHref,
  icon,
}) => {
  const { session } = useSessionQuery();
  return (
    <Stack spacing="sm">
      <Flex align="center" justify="space-between">
        <Flex align="center" sx={{ gap: "5px" }}>
          {icon}
          <Title order={4}>{title}</Title>
        </Flex>
        <Button
          rightIcon={<HiArrowRight size={15} />}
          component={Link}
          href={readMoreHref}
          variant="outline"
        >
          もっと見る
        </Button>
      </Flex>
      {themes.length === 0 ? (
        <NothingTheme page="Home" user={session?.user} />
      ) : (
        <>
          <ThemeCardContainer themes={themes ?? []} />
        </>
      )}
    </Stack>
  );
};
