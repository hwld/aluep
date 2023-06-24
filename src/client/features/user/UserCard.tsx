import { UserIcon } from "@/client/features/user/UserIcon";
import { TextLink } from "@/client/ui/TextLink";
import { User } from "@/server/models/user";
import { Routes } from "@/share/routes";
import { Card, Stack, Text } from "@mantine/core";
import { useRouter } from "next/router";

export const userCardMinWidthPx = 350;

type Props = { user: User };
export const UserCard: React.FC<Props> = ({ user }) => {
  const router = useRouter();

  const handleGoUserDetail = () => {
    router.push(Routes.user(user.id));
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
        transition: "all 100ms",
        outline: "transparent solid 0px",
        "&:hover": {
          outline: `${theme.colors.red[6]} solid 2px`,
          outlineOffset: "2px",
        },
      })}
      onClick={handleGoUserDetail}
    >
      <UserIcon iconSrc={user.image} />
      <Stack spacing={3} sx={{ flexShrink: 1, minWidth: 0 }}>
        <TextLink href={Routes.user(user.id)}>
          <Text
            sx={{
              flexShrink: 0,
            }}
            truncate
          >
            {user.name}
          </Text>
        </TextLink>

        <Text
          sx={{ flexShrink: 1, minHeight: 0, overflow: "hidden" }}
          size="sm"
          color="gray.5"
        >
          {user.profile}
        </Text>
      </Stack>
    </Card>
  );
};
