import { DevelopmentLikeButton } from "@/client/features/development/DevelopmentLikeButton";
import { DevelopmentMenuButton } from "@/client/features/development/DevelopmentMenuButton";
import { DevelopmentStatusBadge } from "@/client/features/development/DevelopmentStatusBadge";
import { UserIconLink } from "@/client/features/user/UserIconLink";
import { formatDate } from "@/client/lib/utils";
import { TextLink } from "@/client/ui/TextLink";
import { Development } from "@/server/models/development";
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
  Title,
  useMantineTheme,
} from "@mantine/core";
import { BsGithub } from "react-icons/bs";
import { MdAccessTime, MdUpdate } from "react-icons/md";
import { TbFileText, TbLink } from "react-icons/tb";

type Props = {
  development: Development;
  onToggleDevelopmentLike: () => void;
  isDeveloper: boolean;
};

export const DevelopmentDetailCard: React.FC<Props> = ({
  development,
  onToggleDevelopmentLike,
  isDeveloper,
}) => {
  const { colors } = useMantineTheme();

  return (
    <Card w="100%" h="100%">
      <Grid>
        {/* 開発情報 */}
        <Grid.Col xs={12} md={7}>
          <Stack h="100%" spacing={0} justify="space-between">
            <Stack spacing="xs">
              <DevelopmentStatusBadge status={development.status} size="xl" />
              <Flex gap={5}>
                <Box sx={() => ({ flexShrink: 0 })}>
                  <TbFileText color={colors.red[7]} size={30} />
                </Box>
                <Stack spacing={0} miw={0}>
                  <TextLink href={Routes.idea(development.ideaId)}>
                    <Text c="gray.7" size="xl" fw="bold" truncate>
                      {development.ideaTitle}
                    </Text>
                  </TextLink>
                  <Text color="red.7" size="lg" fw="bold" ml="md">
                    の開発情報
                  </Text>
                </Stack>
              </Flex>
            </Stack>
            <Divider my="sm" />
            <Stack spacing={0}>
              <Flex justify="space-between" align="center">
                <DevelopmentLikeButton
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
                    leftIcon={<BsGithub size={20} />}
                  >
                    コードを見る
                  </Button>
                  {development.developedItemUrl !== "" && (
                    <Button
                      component="a"
                      href={development.developedItemUrl}
                      target="_blank"
                      leftIcon={<TbLink size={20} />}
                      color="gray.5"
                    >
                      リンクを開く
                    </Button>
                  )}
                </Flex>
              </Flex>
            </Stack>
            <Divider my="sm" />
            <Stack spacing={0}>
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
        <Grid.Col xs={12} md={5}>
          <Stack ml="sm" h="100%">
            <Box sx={{ position: "absolute", top: 10, right: 10 }}>
              <DevelopmentMenuButton
                development={development}
                isOwner={isDeveloper}
              />
            </Box>
            <Flex mt="sm" gap="xs" align="center">
              <UserIconLink
                userId={development.developerUserId}
                iconSrc={development.developerUserImage}
                size="lg"
              />
              <TextLink
                href={Routes.user(development.developerUserId)}
                height="min-content"
              >
                <Title truncate size={18} miw={0}>
                  {development.developerUserName}
                </Title>
              </TextLink>
            </Flex>
            <Box
              w="100%"
              bg="gray.2"
              p="sm"
              sx={{ borderRadius: "5px", overflow: "auto", flexGrow: 1 }}
            >
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
