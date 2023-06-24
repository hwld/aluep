import { userCardMinWidthPx } from "@/client/features/user/UserCard";
import { UserIcon } from "@/client/features/user/UserIcon";
import { Card, Stack, Text } from "@mantine/core";
import { Session } from "next-auth";

type Props = { user: Session["user"] };
export const UserSummaryCard: React.FC<Props> = ({ user }) => {
  return (
    <Card
      miw={userCardMinWidthPx}
      w="100%"
      sx={(theme) => ({
        display: "flex",
        gap: theme.spacing.sm,
        maxHeight: "100px",
      })}
    >
      <UserIcon size="lg" iconSrc={user.image} />
      <Stack spacing={3} sx={{ flexShrink: 1, minWidth: 0 }}>
        <Text
          truncate
          sx={{
            flexShrink: 0,
          }}
        >
          {user.name}
        </Text>

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
