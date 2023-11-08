import { DevDetailCardTitle } from "@/client/features/dev/DevDetailCardTitle/DevDetailCardTitle";
import { DevLikeButton } from "@/client/features/dev/DevLikeButton/DevLikeButton";
import { DevMenuButton } from "@/client/features/dev/DevMenuButton/DevMenuButton";
import { DevStatusBadge } from "@/client/features/dev/DevStatusBadge/DevStatusBadge";
import { UserIconLink } from "@/client/features/user/UserIconLink/UserIconLink";
import { convertToGithubDevUrl } from "@/client/lib/convertToGithubDevUrl";
import { formatDate } from "@/client/lib/utils";
import { AppTitle } from "@/client/ui/AppTitle/AppTitle";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { Dev } from "@/models/dev";
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
import {
  IconBrandGithub,
  IconClock,
  IconLink,
  IconRotateClockwise2,
} from "@tabler/icons-react";
import classes from "./DevDetailCard.module.css";

type Props = {
  dev: Dev;
  isDeveloper: boolean;
};

export const DevDetailCard: React.FC<Props> = ({ dev, isDeveloper }) => {
  return (
    <Card w="100%" h="100%">
      <Grid>
        {/* 開発情報 */}
        <Grid.Col span={{ xs: 12, md: 7 }}>
          <Stack h="100%" gap={0} justify="space-between">
            <Stack gap="xs">
              <DevStatusBadge status={dev.status} size="xl" />
              <DevDetailCardTitle dev={dev} />
            </Stack>
            <Divider my="sm" />
            <Stack gap={0}>
              <Flex justify="space-between" align="center">
                <DevLikeButton dev={dev} disabled={isDeveloper} />
                <Flex gap="md">
                  <Button
                    component={"a"}
                    href={convertToGithubDevUrl(dev.githubUrl)}
                    target="_blank"
                    leftSection={<IconBrandGithub height={20} width={20} />}
                  >
                    コードを見る
                  </Button>
                  {dev.developedItemUrl !== "" && (
                    <Button
                      component="a"
                      href={dev.developedItemUrl}
                      target="_blank"
                      leftSection={<IconLink width={20} height={20} />}
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
                  <IconClock size={20} color="var(--mantine-color-gray-7)" />
                  <Text>{formatDate(new Date(dev.createdAt))}</Text>
                </Flex>
                <Flex align="center" gap={5}>
                  <IconRotateClockwise2
                    size={20}
                    color="var(--mantine-color-gray-7)"
                  />
                  <Text>{formatDate(new Date(dev.updatedAt))}</Text>
                </Flex>
              </Flex>
            </Stack>
          </Stack>
        </Grid.Col>

        {/* 開発者情報 */}
        <Grid.Col span={{ xs: 12, md: 5 }}>
          <Stack ml="sm" h="100%" pt="15px">
            <Box style={{ position: "absolute", top: "10px", right: "10px" }}>
              <DevMenuButton dev={dev} isOwner={isDeveloper} />
            </Box>
            <Flex mt="sm" gap="xs" align="center">
              <UserIconLink
                userId={dev.developer.id}
                iconSrc={dev.developer.imageUrl}
                size="lg"
              />
              <TextLink href={Routes.user(dev.developer.id)}>
                <AppTitle size={18} miw={0}>
                  {dev.developer.name}
                </AppTitle>
              </TextLink>
            </Flex>
            <Box w="100%" bg="gray.2" p="sm" className={classes.comment}>
              {!dev.comment ? (
                <Text c="gray.4">コメントはありません</Text>
              ) : (
                <Text size="sm">{dev.comment}</Text>
              )}
            </Box>
          </Stack>
        </Grid.Col>
      </Grid>
    </Card>
  );
};
