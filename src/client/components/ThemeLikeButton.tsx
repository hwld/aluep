import { ActionIcon, Flex, Text } from "@mantine/core";
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from "react-icons/md";

type Props = {
  likes: number;
  likedByLoggedInUser: boolean;
  onLikeTheme: () => void;
  disabled?: boolean;
};
export const ThemeLikeButton: React.FC<Props> = ({
  likes,
  likedByLoggedInUser,
  onLikeTheme,
  disabled,
}) => {
  return (
    <Flex direction="column" align="center">
      <ActionIcon
        disabled={disabled}
        color={likedByLoggedInUser ? "pink" : undefined}
        size={60}
        radius="xl"
        sx={(theme) => ({
          boxShadow: theme.shadows.md,
          transition: "all 200ms",
          backgroundColor: likedByLoggedInUser
            ? theme.fn.rgba(theme.colors.pink[1], 0.8)
            : theme.colors.gray[1],
          "&:hover": {
            backgroundColor: likedByLoggedInUser
              ? theme.colors.gray[3]
              : theme.colors.pink[1],
          },
        })}
        onClick={onLikeTheme}
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
