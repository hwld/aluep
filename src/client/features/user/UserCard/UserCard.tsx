import { UserIcon } from "@/client/features/user/UserIcon/UserIcon";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { User } from "@/models/user";
import { Routes } from "@/share/routes";
import { Card, Stack, Text } from "@mantine/core";
import { useRouter } from "next/router";
import classes from "./UserCard.module.css";

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
      className={classes.root}
      onClick={handleGoUserDetail}
    >
      <UserIcon iconSrc={user.image} />
      <Stack gap={3} style={{ flexShrink: 1, minWidth: 0 }}>
        <TextLink href={Routes.user(user.id)}>
          <Text
            style={{
              flexShrink: 0,
            }}
            truncate
          >
            {user.name}
          </Text>
        </TextLink>

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
