import { ActionIcon, Flex, Text } from "@mantine/core";
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from "react-icons/md";

type Props = {
  likes: number;
  likedByLoggedInUser: boolean;
  onClick: () => void;
};
export const ThemeLikeButton: React.FC<Props> = ({
  likes,
  likedByLoggedInUser,
  onClick,
}) => {
  return (
    <Flex direction="column" align="center">
      <ActionIcon
        color={likedByLoggedInUser ? "pink" : undefined}
        size={60}
        radius="xl"
        bg="gray.1"
        sx={(theme) => ({
          boxShadow: theme.shadows.md,
          transition: "all 200ms",
          "&:hover": {
            backgroundColor: likedByLoggedInUser
              ? theme.colors.gray[2]
              : theme.colors.pink[1],
          },
        })}
        onClick={onClick}
      >
        {likedByLoggedInUser ? (
          <MdOutlineFavorite size="70%" style={{ marginTop: "4px" }} />
        ) : (
          <MdOutlineFavoriteBorder size="70%" style={{ marginTop: "4px" }} />
        )}
      </ActionIcon>
      <Text>{likes}</Text>
    </Flex>
  );
};
