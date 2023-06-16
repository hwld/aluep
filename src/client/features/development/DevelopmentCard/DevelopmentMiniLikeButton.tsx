import { ActionIcon, Flex, Text, useMantineTheme } from "@mantine/core";
import { TbHeart } from "react-icons/tb";
import { stopPropagation } from "../../../lib/utils";

type Props = {
  likes: number;
  likedByLoggedInUser: boolean;
  onClick: () => void;
  disabled?: boolean;
};
export const DevelopmentMiniLikeButton: React.FC<Props> = ({
  likes,
  likedByLoggedInUser,
  onClick,
  disabled,
}) => {
  const { colors } = useMantineTheme();

  return (
    <Flex align="center" onClick={stopPropagation}>
      <ActionIcon
        disabled={disabled}
        color={likedByLoggedInUser ? "pink" : undefined}
        size={30}
        onClick={onClick}
        sx={(theme) => ({
          borderRadius: "50%",
          transition: "all 200ms",
          "&:hover": {
            backgroundColor: likedByLoggedInUser
              ? theme.colors.gray[2]
              : theme.colors.pink[1],
          },
        })}
      >
        {likedByLoggedInUser ? (
          <TbHeart size="78%" color="transparent" fill={colors.pink[7]} />
        ) : (
          <TbHeart size="75%" color={colors.gray[7]} />
        )}
      </ActionIcon>
      <Text>{likes}</Text>
    </Flex>
  );
};
