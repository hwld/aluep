import {
  ActionIcon,
  Anchor,
  Stack,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import { TbHeart } from "react-icons/tb";

type Props = {
  likes: number;
  likedByLoggedInUser: boolean;
  onLikeTheme: () => void;
  disabled?: boolean;
  themeId: string;
};
export const ThemeLikeButton: React.FC<Props> = ({
  likes,
  likedByLoggedInUser,
  onLikeTheme,
  disabled,
  themeId,
}) => {
  const mantineTheme = useMantineTheme();

  return (
    <Stack align="center" spacing={3}>
      <ActionIcon
        disabled={disabled}
        color={likedByLoggedInUser ? "pink" : undefined}
        size={50}
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
          "&[data-disabled]": {
            backgroundColor: theme.colors.gray[3],
            borderColor: theme.colors.gray[3],
            boxShadow: theme.shadows.xs,
          },
        })}
        onClick={onLikeTheme}
      >
        {likedByLoggedInUser ? (
          <TbHeart
            size="75%"
            color="transparent"
            fill={mantineTheme.colors.pink[7]}
            style={{ marginTop: "4px" }}
          />
        ) : (
          <TbHeart
            size="70%"
            color={mantineTheme.colors.gray[5]}
            style={{ marginTop: "4px" }}
          />
        )}
      </ActionIcon>
      <Tooltip label="いいねしたユーザーを表示する" position="right">
        <Anchor
          component={Link}
          href={`/themes/${themeId}/liking-users`}
          size="sm"
          sx={(theme) => ({
            pointerEvents: likes === 0 ? "none" : "auto",
            textDecoration: likes === 0 ? "none" : "underline",
            color: likedByLoggedInUser ? theme.colors.pink[7] : "inherit",
            "&:hover": { color: theme.colors.red[7] },
          })}
        >
          {likes}
        </Anchor>
      </Tooltip>
    </Stack>
  );
};
