import {
  ActionIcon,
  Avatar,
  Box,
  Card,
  Flex,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import { BsGithub } from "react-icons/bs";
import { ThemeDeveloper } from "../../server/models/themeDeveloper";
import { DeveloperLikeButton } from "./DeveloperLikeButton";

type Props = {
  developer: ThemeDeveloper;
  onLikeDeveloper: (developerId: string, like: boolean) => void;
};
export const ThemeDeveloperCard: React.FC<Props> = ({
  developer,
  onLikeDeveloper: onLike,
}) => {
  const mantineTheme = useMantineTheme();

  const handleLikeDeveloper = () => {
    onLike(developer.id, !developer.likedByLoggedInUser);
  };

  return (
    <Card
      key={developer.userId}
      sx={() => ({
        cursor: "pointer",
        position: "static",
      })}
    >
      <Flex justify="space-between">
        <Flex gap={10}>
          <Avatar
            src={developer.image}
            size="lg"
            radius="xl"
            sx={(theme) => ({
              border: "2px solid",
              borderColor: theme.colors.gray[2],
            })}
          />
          <Text fw="bold" size="lg">
            {developer.name}
          </Text>
        </Flex>
        <Box>
          <Tooltip
            label="コードを見に行く"
            color="gray.5"
            position="top"
            withArrow
            transition="pop"
          >
            <ActionIcon
              size={50}
              component={Link}
              href={developer.githubUrl}
              target="_blank"
              sx={(theme) => ({
                transition: "all 200ms",
                "&:hover": {
                  backgroundColor: theme.fn.rgba(theme.colors.gray[7], 0.1),
                },
              })}
            >
              <BsGithub size="80%" fill={mantineTheme.colors.gray[7]} />
            </ActionIcon>
          </Tooltip>
        </Box>
      </Flex>
      <Flex align="center" justify="space-between" mt={10}>
        <Text size="sm" color="gray.5">
          参加日: {new Date(developer.createdAt).toLocaleString()}
        </Text>
        <Box>
          <DeveloperLikeButton
            likes={developer.likes}
            likedByLoggedInUser={developer.likedByLoggedInUser}
            onClick={handleLikeDeveloper}
          />
        </Box>
      </Flex>
    </Card>
  );
};
