import { DevLikeButton } from "@/client/features/dev/DevLikeButton/DevLikeButton";
import { DevMenuButton } from "@/client/features/dev/DevMenuButton/DevMenuButton";
import { DevStatusBadge } from "@/client/features/dev/DevStatusBadge/DevStatusBadge";
import { UserIconLink } from "@/client/features/user/UserIconLink/UserIconLink";
import { formatDate } from "@/client/lib/utils";
import { AppTitle } from "@/client/ui/AppTitle/AppTitle";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { Development } from "@/models/development";
import { Routes } from "@/share/routes";
import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Stack,
  Text,
} from "@mantine/core";
import { BsGithub } from "react-icons/bs";
import { MdAccessTime, MdUpdate } from "react-icons/md";
import { TbFileText, TbLink } from "react-icons/tb";
import classes from "./DevDetailCard.module.css";

type Props = {
  development: Development;
  onToggleDevelopmentLike: () => void;
  isDeveloper: boolean;
};

export const DevDetailCard: React.FC<Props> = ({
  development,
  onToggleDevelopmentLike,
  isDeveloper,
}) => {
  return (
    <Card w="100%" h="100%">
      <Grid>
        {/* 開発情報 */}
        <Grid.Col span={{ xs: 12, md: 7 }}>
          <Stack h="100%" gap={0} justify="space-between">
            <Stack gap="xs">
              <DevStatusBadge status={development.status} size="xl" />
              <Flex gap={5}>
                <Box className={classes["icon-wrapper"]}>
                  <TbFileText color="var(--mantine-color-red-7)" size={30} />
                </Box>
                <Stack gap={0} miw={0}>
                  <TextLink href={Routes.idea(development.ideaId)}>
                    <Text c="gray.7" size="xl" fw="bold" truncate>
                      {development.ideaTitle}
                    </Text>
                  </TextLink>
                  <Text c="red.7" size="lg" fw="bold" ml="md">
                    の開発情報
                  </Text>
                </Stack>
              </Flex>
            </Stack>
            <Divider my="sm" />
            <Stack gap={0}>
              <Flex justify="space-between" align="center">
                <DevLikeButton
                  developmentId={development.id}
                  ideaId={development.ideaId}
                  likes={development.likes}
                  likedByLoggedInUser={development.likedByLoggedInUser}
                  onToggleIdeaLike={onToggleDevelopmentLike}
                  disabled={isDeveloper}
                />
                <Flex gap="md">
                  <Button
                    component={"a"}
                    href={development.githubUrl}
                    target="_blank"
                    leftSection={<BsGithub size={20} />}
                  >
                    コードを見る
                  </Button>
                  {development.developedItemUrl !== "" && (
                    <Button
                      component="a"
                      href={development.developedItemUrl}
                      target="_blank"
                      leftSection={<TbLink size={20} />}
                      color="gray.5"
                    >
                      リンクを開く
                    </Button>
                  )}
                </Flex>
              </Flex>
            </Stack>
            <Divider my="sm" />
            <Stack gap={0}>
              <Flex gap="xl">
                <Flex align="center" gap={5}>
                  <MdAccessTime size={20} />
                  <Text>{formatDate(new Date(development.createdAt))}</Text>
                </Flex>
                <Flex align="center" gap={5}>
                  <MdUpdate size={20} />
                  <Text>{formatDate(new Date(development.updatedAt))}</Text>
                </Flex>
              </Flex>
            </Stack>
          </Stack>
        </Grid.Col>

        {/* 開発者情報 */}
        <Grid.Col span={{ xs: 12, md: 5 }}>
          <Stack ml="sm" h="100%" pt="15px">
            <Box style={{ position: "absolute", top: "10px", right: "10px" }}>
              <DevMenuButton development={development} isOwner={isDeveloper} />
            </Box>
            <Flex mt="sm" gap="xs" align="center">
              <UserIconLink
                userId={development.developerUserId}
                iconSrc={development.developerUserImage}
                size="lg"
              />
              <TextLink href={Routes.user(development.developerUserId)}>
                <AppTitle size={18} miw={0}>
                  {development.developerUserName}
                </AppTitle>
              </TextLink>
            </Flex>
            <Box w="100%" bg="gray.2" p="sm" className={classes.comment}>
              {!development.comment ? (
                <Text c="gray.4">コメントはありません</Text>
              ) : (
                <Text size="sm">{development.comment}</Text>
              )}
            </Box>
          </Stack>
        </Grid.Col>
      </Grid>
    </Card>
  );
};
