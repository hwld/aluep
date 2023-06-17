import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { BsGithub } from "react-icons/bs";
import { TbFileText } from "react-icons/tb";
import { Development } from "../../../server/models/development";
import { Routes } from "../../../share/routes";
import { TextLink } from "../../ui/TextLink";
import { DevelopmentStatusBadge } from "./DevelopmentCard/DevelopmentStatusBadge";
import { DevelopmentLikeButton } from "./DevelopmentLikeButton";

type Props = {
  development: Development;
  onToggleDevelopmentLike: () => void;
  isLoggedInUserDeveloper: boolean;
};

export const DevelopmentDetailCard: React.FC<Props> = ({
  development,
  onToggleDevelopmentLike,
  isLoggedInUserDeveloper,
}) => {
  const { colors } = useMantineTheme();

  return (
    <Card w="100%" h="100%">
      <Stack h="100%" spacing={0} justify="space-between">
        <Stack spacing={0}>
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
          <Flex justify="space-between">
            <Box mt="xs">
              <DevelopmentStatusBadge status={development.status} size="xl" />
            </Box>
            <DevelopmentLikeButton
              developmentId={development.id}
              ideaId={development.ideaId}
              likes={development.likes}
              likedByLoggedInUser={development.likedByLoggedInUser}
              onToggleIdeaLike={onToggleDevelopmentLike}
              disabled={isLoggedInUserDeveloper}
            />
          </Flex>
        </Stack>
        <Stack spacing={0}>
          <Divider my="md" />
          <Flex gap="md">
            <Button
              component={"a"}
              href={development.githubUrl}
              target="_blank"
              leftIcon={<BsGithub size={20} />}
            >
              コードを見る
            </Button>
            {/* TODO: developmentにlinkを追加したい */}
            {/* <Button leftIcon={<TbLink size={20} />} color="gray.5">
              リンクを開く
            </Button> */}
          </Flex>
        </Stack>
      </Stack>
    </Card>
  );
};
