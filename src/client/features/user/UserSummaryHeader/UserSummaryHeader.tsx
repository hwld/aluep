import { UserIcon } from "@/client/features/user/UserIcon/UserIcon";
import { AppLinkify } from "@/client/ui/AppLinkify/AppLinkify";
import { AppTitle } from "@/client/ui/AppTitle/AppTitle";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { Routes } from "@/share/routes";
import { Center, Flex, Stack, Text } from "@mantine/core";
import { Session } from "next-auth";

type Props = { user: Session["user"] };
export const UserSummaryHeader: React.FC<Props> = ({ user }) => {
  return (
    <Flex gap="md" align="flex-start">
      <Center
        style={{
          flexShrink: 0,
          backgroundColor: "var(--mantine-color-gray-1)",
          borderRadius: "10px",
          padding: "var(--mantine-spacing-xs)",
        }}
      >
        <UserIcon size={70} iconSrc={user.image} />
      </Center>
      <Stack gap="sm" miw={0}>
        <TextLink href={Routes.user(user.id)}>
          <AppTitle order={4} size="h2" truncate>
            {user.name}
          </AppTitle>
        </TextLink>
        <AppLinkify>
          <Text
            style={{ flexShrink: 1, minHeight: 0, overflow: "hidden" }}
            size="sm"
            c="gray.5"
          >
            {user.profile}
          </Text>
        </AppLinkify>
      </Stack>
    </Flex>
  );
};
