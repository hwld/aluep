import { Card, Stack, Text } from "@mantine/core";
import { AppThemeLike, User } from "@prisma/client";
import { useRouter } from "next/router";
import { TextLink } from "./TextLink";
import { UserIcon } from "./UserIcon";

export const userCardMinWidthPx = 350;

type Props = {
  user: User;
  appTheme: AppThemeLike;
};
export const LikingUserCard: React.FC<Props> = ({ user, appTheme }) => {
  const router = useRouter();

  const handleGoUserDetail = () => {
    router.push(`/users/${user.id}`);
  };

  return (
    <Card
      miw={userCardMinWidthPx}
      w="100%"
      sx={(theme) => ({
        display: "flex",
        gap: theme.spacing.sm,
        maxHeight: "100px",
        cursor: "pointer",
        position: "static",
        transition: "all 150ms",
        "&:hover": {
          boxShadow: `${theme.shadows.lg}, 0 0 0 2px ${theme.colors.red[7]}`,
        },
      })}
      onClick={handleGoUserDetail}
    >
      <UserIcon iconSrc={user.image} />
      <Stack spacing={3} sx={{ flexShrink: 1, minWidth: 0 }}>
        <TextLink href={`/users/${user.id}`}>
          <Text
            sx={{
              flexShrink: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user.name}
          </Text>
        </TextLink>

        <Text
          sx={{ flexShrink: 1, minHeight: 0, overflow: "hidden" }}
          size="sm"
          color="gray.5"
        >
          いいねした日: {new Date(appTheme.createdAt).toLocaleString()}
        </Text>
      </Stack>
    </Card>
  );
};
