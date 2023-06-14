import {
  Card,
  Flex,
  Stack,
  Text,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import React from "react";
import { MdComputer } from "react-icons/md";
import { TbHeart } from "react-icons/tb";
import { Development } from "../../server/models/development";
import { Idea } from "../../server/models/idea";
import { DevelopmentMenuButton } from "../features/development/DevelopmentCard/DevelopmentMenuButton";
import { DevelopmentStatusBadge } from "../features/development/DevelopmentCard/DevelopmentStatusBadge";
import { IdeaSummaryCard } from "../features/idea/IdeaSummaryCard";
import { useSessionQuery } from "../features/session/useSessionQuery";
import { UserIconLink } from "../features/user/UserIconLink";
import { GitHubCodeButton } from "../ui/GitHubCodeButton";

type Props = { development: Development; idea: Idea };

// TODO: UI
export const DevelopmentDetailPage: React.FC<Props> = ({
  development,
  idea,
}) => {
  const { session } = useSessionQuery();
  const mantineTheme = useMantineTheme();
  const isDevelopment = development.developerUserId === session?.user.id;

  return (
    <>
      <Stack maw={800} w="100%" m="auto" spacing="lg">
        <Flex align="center" gap="xs">
          <MdComputer
            size="30px"
            color={mantineTheme.colors.red[7]}
            style={{ marginTop: "3px" }}
          />
          <Title order={3}>お題開発情報</Title>
        </Flex>
        <Stack spacing="xs">
          <DevelopmentStatusBadge status={development.status} size="xl" />
        </Stack>
        <Stack spacing="xs">
          <Text c="gray.5">開発しているお題</Text>
          <IdeaSummaryCard idea={idea} />
        </Stack>
        <Stack spacing="xs">
          <Text c="gray.5">開発者の情報</Text>
          <Flex direction="row" gap={10} h={300}>
            <Card w={250} sx={{ flexShrink: 0 }}>
              <Flex direction="column" justify="space-between" h="100%">
                <Flex mt={-5}>
                  <DevelopmentMenuButton
                    development={development}
                    idea={idea}
                    isOwner={isDevelopment}
                  />
                </Flex>
                <Flex
                  align="center"
                  mt={-40}
                  gap={20}
                  wrap="wrap"
                  direction="column"
                >
                  <UserIconLink
                    size="xl"
                    iconSrc={development.developerUserImage}
                    userId={development.developerUserId}
                  />
                </Flex>
                <Flex align="center" justify="center">
                  <Text>{development.developerUserName}</Text>
                </Flex>
                <Flex gap={40} mt={10} wrap="wrap" justify="center">
                  <Tooltip
                    label="開発に対するいいねの合計"
                    position="top"
                    withArrow
                    transition="pop"
                  >
                    <Flex align="center" wrap="wrap" gap="3px">
                      <TbHeart
                        color="transparent"
                        fill={mantineTheme.colors.red[7]}
                        size="30"
                      />
                      <Text>{development.likes}</Text>
                    </Flex>
                  </Tooltip>
                  <GitHubCodeButton gitHubUrl={development.githubUrl} />
                </Flex>
              </Flex>
            </Card>

            <Card mih={20} sx={{ flexGrow: 1 }}>
              <Card.Section withBorder inheritPadding py="md">
                <Text c="gray.5">コメント</Text>
              </Card.Section>

              <Card.Section inheritPadding mt="sm" pb="md">
                <Text
                  placeholder="開発に対するコメント"
                  mah={200}
                  sx={{ overflow: "auto" }}
                >
                  {development.comment}
                </Text>
              </Card.Section>
            </Card>
          </Flex>
        </Stack>
      </Stack>
    </>
  );
};
