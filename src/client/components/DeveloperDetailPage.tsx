import {
  ActionIcon,
  Box,
  Card,
  Flex,
  Stack,
  Text,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import React from "react";
import { BsGithub } from "react-icons/bs";
import { MdComputer, MdOutlineFavorite } from "react-icons/md";
import { Theme } from "../../server/models/theme";
import { ThemeDeveloper } from "../../server/models/themeDeveloper";
import { useSessionQuery } from "../hooks/useSessionQuery";
import { DeveloperMenuButton } from "./DeveloperCard/DeveloperMenuButton";
import { ThemeSummaryCard } from "./ThemeSummaryCard";
import { UserIconLink } from "./UserIconLink";

type Props = { developer: ThemeDeveloper; theme: Theme };

export const DeveloperDetailPage: React.FC<Props> = ({ developer, theme }) => {
  const { session } = useSessionQuery();
  const mantineTheme = useMantineTheme();
  const isDeveloper = developer.userId === session?.user.id;

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
          <Text c="gray.5">開発しているお題</Text>
          <ThemeSummaryCard theme={theme} />
        </Stack>
        <Stack spacing="xs">
          <Text c="gray.5">開発者の情報</Text>
          <Flex direction="row" gap={10} h={300}>
            <Card w={250} sx={{ flexShrink: 0 }}>
              <Flex direction={"column"} justify={"space-between"} h="100%">
                <Flex mt={-5}>
                  <DeveloperMenuButton
                    developer={developer}
                    theme={theme}
                    isOwner={isDeveloper}
                  />
                </Flex>
                <Flex
                  align={"center"}
                  mt={-40}
                  gap={20}
                  wrap="wrap"
                  direction={"column"}
                >
                  <UserIconLink
                    size="xl"
                    iconSrc={developer.image}
                    userId={developer.userId}
                  />
                </Flex>
                <Flex align={"center"} justify={"center"}>
                  <Text>{developer.name}</Text>
                </Flex>

                <Flex gap={40} mt={10} wrap="wrap" justify={"center"}>
                  <Box>
                    <Tooltip
                      label="開発者に対するいいねの合計"
                      position="top"
                      withArrow
                      transition="pop"
                    >
                      <Flex align={"center"} wrap="wrap">
                        <MdOutlineFavorite
                          color={mantineTheme.colors.red[7]}
                          size="30"
                          style={{ marginRight: "2px" }}
                        />
                        <Text>{developer.likes}</Text>
                      </Flex>
                    </Tooltip>
                  </Box>

                  <Box>
                    <Tooltip
                      label="GitHubへのアクセス"
                      position="top"
                      withArrow
                      transition="pop"
                    >
                      <Flex align={"center"} wrap="wrap" direction={"column"}>
                        <ActionIcon
                          size={30}
                          component={Link}
                          // githubのURLをgithub1sに変換
                          href={developer.githubUrl.replace(
                            /^(https:\/\/github)(.com)/,
                            "$11s$2"
                          )}
                          target="_blank"
                          sx={(theme) => ({
                            transition: "all 200ms",
                            "&:hover": {
                              backgroundColor: theme.fn.rgba(
                                theme.colors.gray[7],
                                0.1
                              ),
                            },
                          })}
                        >
                          <BsGithub
                            size="90%"
                            fill={mantineTheme.colors.gray[7]}
                          />
                        </ActionIcon>
                      </Flex>
                    </Tooltip>
                  </Box>
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
                  {developer.comment}
                </Text>
              </Card.Section>
            </Card>
          </Flex>
        </Stack>
      </Stack>
    </>
  );
};
