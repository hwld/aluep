import { ActionIcon, Flex, Text, useMantineTheme } from "@mantine/core";
import { TbHeart } from "react-icons/tb";
import { Routes } from "../../../share/routes";
import { stopPropagation } from "../../lib/utils";
import { TextLink } from "../../ui/TextLink";

type Props = {
  ideaId: string;
  developmentId: string;
  likes: number;
  likedByLoggedInUser: boolean;
  onToggleIdeaLike: () => void;
  disabled?: boolean;
};
export const DevelopmentLikeButton: React.FC<Props> = ({
  ideaId,
  developmentId,
  likes,
  likedByLoggedInUser,
  onToggleIdeaLike,
  disabled,
}) => {
  const { colors } = useMantineTheme();

  return (
    <Flex align="center" onClick={stopPropagation} gap="xs">
      <ActionIcon
        disabled={disabled}
        color={likedByLoggedInUser ? "pink" : undefined}
        size={50}
        onClick={onToggleIdeaLike}
        sx={(theme) => ({
          borderRadius: "50%",
          border: `solid 1px ${
            likedByLoggedInUser ? theme.colors.pink[2] : theme.colors.gray[3]
          }`,
          transition: "all 200ms",
          backgroundColor: likedByLoggedInUser
            ? theme.fn.rgba(theme.colors.pink[1], 0.8)
            : "transparent",
          "&:hover": {
            backgroundColor: likedByLoggedInUser
              ? theme.colors.gray[2]
              : theme.colors.pink[1],
          },
          // アイコンにtransitionをつけるために動的にクラスを付与してスタイリングする
          "& .like-icon": {
            marginTop: "4px",
            height: "75%",
            width: "75%",
            color: colors.gray[5],
            fill: "transparent",
            transition: "all 200ms",
            "&.liked": {
              height: "75%",
              width: "75%",
              color: theme.colors.pink[7],
              fill: theme.colors.pink[7],
            },
          },
          "&[data-disabled]": {
            backgroundColor: theme.colors.gray[3],
            borderColor: theme.colors.gray[3],
          },
        })}
      >
        <TbHeart
          className={`like-icon ${likedByLoggedInUser ? "liked" : ""}`}
        />
      </ActionIcon>
      <TextLink
        href={Routes.developmentLikers(ideaId, developmentId)}
        disabled={likes === 0}
      >
        <Text size="xl" fw="bold">
          {likes}
        </Text>
      </TextLink>
    </Flex>
  );
};
