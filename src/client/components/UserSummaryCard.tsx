import { Card, Stack, Text } from "@mantine/core";
import { Session } from "next-auth";
import { userCardMinWidthPx } from "./UserCard";
import { UserIcon } from "./UserIcon";

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
          sx={{
            flexShrink: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
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
