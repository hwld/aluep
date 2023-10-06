import { userCardMinWidthPx } from "@/client/features/user/UserCard/UserCard";
import { UserIcon } from "@/client/features/user/UserIcon/UserIcon";
import { Card, Stack, Text } from "@mantine/core";
import { Session } from "next-auth";

type Props = { user: Session["user"] };
export const UserSummaryCard: React.FC<Props> = ({ user }) => {
  return (
    <Card
      miw={userCardMinWidthPx}
      w="100%"
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "var(--mantine-spacing-sm)",
        maxHeight: "100px",
      }}
    >
      <UserIcon size="lg" iconSrc={user.image} />
      <Stack gap={3} style={{ flexShrink: 1, minWidth: 0 }}>
        <Text
          truncate
          style={{
            flexShrink: 0,
          }}
        >
          {user.name}
        </Text>

        <Text
          style={{ flexShrink: 1, minHeight: 0, overflow: "hidden" }}
          size="sm"
          c="gray.5"
        >
          {user.profile}
        </Text>
      </Stack>
    </Card>
  );
};
