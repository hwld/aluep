import {
  ActionIcon,
  Box,
  Button,
  Card,
  Flex,
  Text,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import React from "react";
import { BsGithub } from "react-icons/bs";
import { MdOutlineFavorite } from "react-icons/md";
import { Theme } from "../../server/models/theme";
import { ThemeDeveloper } from "../../server/models/themeDeveloper";
import { UserIconLink } from "./UserIconLink";

type Props = { developer: ThemeDeveloper; theme: Theme };

export const DeveloperDetailPage: React.FC<Props> = ({ developer, theme }) => {
  const mantineTheme = useMantineTheme();

  return (
    <>
      <Box w={760} m="auto">
        <Title order={3}>開発者詳細ページ</Title>
      </Box>

      <Flex maw={1200} direction="column" align="center" m="auto">
        <Flex maw={800} mih={300} direction="row" gap={10} mt="xl" h="80%">
          <Card mih={20} w={500}>
            <Card.Section inheritPadding pb="md" pt={10}>
              <Text placeholder="開発に対するコメント" mah={200} />
              {developer.comment}
              <Text />
            </Card.Section>
          </Card>
          <Card h={300} w={250}>
            <Flex direction={"column"} h="100%">
              <Flex align={"center"} gap={20} wrap="wrap" direction={"column"}>
                <div style={{ marginTop: "-10px" }}>
                  <UserIconLink
                    size="xl"
                    iconSrc={developer.image}
                    userId={developer.userId}
                  />
                </div>
              </Flex>
              <Flex align={"center"} justify={"center"} mt={30}>
                <Text>{developer.name}</Text>
              </Flex>

              <Flex gap={70} mt={30} wrap="wrap" justify={"center"}>
                <Flex
                  align={"center"}
                  gap={15}
                  wrap="wrap"
                  direction={"column"}
                >
                  <Box>
                    <Tooltip
                      label="開発者へのいいねの合計"
                      color="gray.5"
                      position="top"
                      withArrow
                      transition="pop"
                    >
                      <Flex align={"center"} wrap="wrap" direction={"column"}>
                        <MdOutlineFavorite
                          color={mantineTheme.colors.red[7]}
                          size="30"
                          style={{ marginTop: "2px" }}
                        />
                      </Flex>
                    </Tooltip>
                  </Box>
                  <div style={{ marginTop: "-12px" }}>{developer.likes}</div>
                </Flex>
                <Flex
                  align={"center"}
                  gap={15}
                  wrap="wrap"
                  direction={"column"}
                >
                  <Box>
                    <Tooltip
                      label="GitHubへのアクセス"
                      color="gray.5"
                      position="top"
                      withArrow
                      transition="pop"
                    >
                      <Flex align={"center"} wrap="wrap" direction={"column"}>
                        <ActionIcon
                          size={30}
                          component={Link}
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
                            size="100"
                            fill={mantineTheme.colors.gray[7]}
                          />
                        </ActionIcon>
                      </Flex>
                    </Tooltip>
                    <div style={{ marginTop: "4px" }}>GitHub</div>
                  </Box>
                </Flex>
              </Flex>
            </Flex>
          </Card>
        </Flex>
        <div style={{ marginLeft: -635, marginTop: 20 }}>
          <Button>コードを見る</Button>
        </div>

        <Title>コメント</Title>

        <Card h={150} w={760} mt="xl">
          <Title order={3}>{theme?.title}</Title>
          <Flex mt="md" gap={5}>
            <UserIconLink iconSrc={theme.user.image} userId={theme.user.id} />
            <Text>{theme?.user.name}</Text>
          </Flex>
        </Card>
      </Flex>

      {/* <div style={{ marginTop: "-295px", marginLeft: "245px" }}>
        <UserIconLink
          size="xl"
          iconSrc={developer.image}
          userId={developer.userId}
        />
      </div> */}
    </>
  );
};
