import { ActionIcon, Flex, Text } from "@mantine/core";
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from "react-icons/md";

type Props = {
  likes: number;
  likedByLoggedInUser: boolean;
  onClick: () => void;
};
export const DeveloperLikeButton: React.FC<Props> = ({
  likes,
  likedByLoggedInUser,
  onClick,
}) => {
  return (
    <Flex align="center">
      <ActionIcon
        color={likedByLoggedInUser ? "pink" : undefined}
        size={30}
        radius="xl"
        onClick={onClick}
        sx={(theme) => ({
          transition: "all 200ms",
          "&:hover": {
            backgroundColor: likedByLoggedInUser
              ? theme.colors.gray[2]
              : theme.colors.pink[1],
          },
        })}
      >
        {likedByLoggedInUser ? (
          <MdOutlineFavorite size="70%" style={{ marginTop: "1px" }} />
        ) : (
          <MdOutlineFavoriteBorder size="70%" style={{ marginTop: "1px" }} />
        )}
      </ActionIcon>
      <Text>{likes}</Text>
    </Flex>
  );
};
