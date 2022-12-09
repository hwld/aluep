import {
  ActionIcon,
  Avatar,
  Box,
  Card,
  Flex,
  Textarea,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import React from "react";
import { BsGithub } from "react-icons/bs";
import { MdOutlineFavorite } from "react-icons/md";
import { Theme } from "../../server/models/theme";
import { ThemeDeveloper } from "../../server/models/themeDeveloper";
import { ThemeCard } from "./ThemeCard/ThemeCard";

type Props = { developer: ThemeDeveloper; theme: Theme };

export const DeveloperDetailPage: React.FC<Props> = ({ developer, theme }) => {
  const mantineTheme = useMantineTheme();

  return (
    <Flex maw={1200} direction="column" align="center" m="auto">
      <Flex maw={1000} mih={300} direction="row" gap={10} mt={60}>
        <Card h={300} w={250}>
          <Card.Section py="xl">
            <Flex align={"center"} gap={15} wrap="wrap" direction={"column"}>
              <Avatar
                src={developer?.image}
                size="xl"
                sx={(theme) => ({
                  borderWidth: "2px",
                  borderColor: theme.colors.gray[2],
                  borderStyle: "solid",
                  borderRadius: "100%",
                })}
              />
              {developer?.name}
            </Flex>
          </Card.Section>

          <Flex gap={70} mt={10} wrap="wrap" justify={"center"}>
            <Flex align={"center"} gap={15} wrap="wrap" direction={"column"}>
              <Box>
                <Tooltip
                  label="開発者へのいいねの合計"
                  color="gray.5"
                  position="top"
                  withArrow
                  transition="pop"
                >
                  <Flex align={"center"} wrap="wrap" direction={"column"}>
                    <MdOutlineFavorite size="30" style={{ marginTop: "2px" }} />
                  </Flex>
                </Tooltip>
              </Box>
              <div style={{ marginTop: "-12px" }}>{developer.likes}</div>
            </Flex>
            <Flex align={"center"} gap={15} wrap="wrap" direction={"column"}>
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
                      href={developer.githubUrl}
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
                      <BsGithub size="100" fill={mantineTheme.colors.gray[7]} />
                    </ActionIcon>
                  </Flex>
                </Tooltip>
                <div style={{ marginTop: "4px" }}>GitHub</div>
              </Box>
            </Flex>
          </Flex>
        </Card>

        <Card mih={20} w={500}>
          <Card.Section withBorder inheritPadding py="md">
            <div>コメント</div>
          </Card.Section>

          <Card.Section inheritPadding mt="sm" pb="md">
            <Textarea
              placeholder="開発に対するコメント"
              value={developer.comment}
              withAsterisk
              readOnly
              autosize
            />
          </Card.Section>
        </Card>
      </Flex>
      <Flex mt={45} w={760}>
        <ThemeCard key={theme.id} theme={theme} />
      </Flex>

      {/* {isJoinTheme && (
        <div>
          <Flex mt={30} gap={15} wrap="wrap">
            <ThemeCard key={theme.id} theme={theme} />
          </Flex>
        </div>
      )} */}
    </Flex>
  );
};
