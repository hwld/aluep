import { useLoggedInUserInfoQuery } from "@/client/features/session/useLoggedInUserInfoQuery";
import { UserIcon } from "@/client/features/user/UserIcon/UserIcon";
import { IconCounter } from "@/client/ui/IconCounter/IconCounter";
import { Flex, Stack, Text } from "@mantine/core";
import { Session } from "next-auth";
import { TbChevronDown, TbCode, TbFileText, TbHeart } from "react-icons/tb";

type Props = { user: Session["user"]; iconWidth: number };

export const LoggedInUserCard: React.FC<Props> = ({ user, iconWidth }) => {
  const { loggedInUserInfo } = useLoggedInUserInfoQuery();
  const textColor = "var(--mantine-color-gray-1)";

  return (
    <Flex
      w="100%"
      align="center"
      justify="space-between"
      style={{ overflow: "hidden" }}
    >
      <Flex gap="xs" miw="0">
        <Stack style={{ flexShrink: 0 }}>
          <UserIcon size={iconWidth} iconSrc={user.image} withBorder={true} />
        </Stack>
        <Stack
          style={{ flexShrink: 1, flexWrap: "nowrap", overflow: "hidden" }}
          gap="xs"
        >
          <Text c="gray.1" fw="bold" size="sm" truncate>
            {user.name}
          </Text>
          {/* アイコン類 */}
          <Flex gap="xs">
            <IconCounter
              icon={<TbHeart color={textColor} />}
              counter={loggedInUserInfo?.allLikes ?? 0}
              counterProps={{ c: textColor, fz: "md" }}
            />

            <IconCounter
              icon={<TbFileText color={textColor} />}
              counter={loggedInUserInfo?.ideas ?? 0}
              counterProps={{ c: textColor, fz: "md" }}
            />

            <IconCounter
              icon={<TbCode color={textColor} />}
              counter={loggedInUserInfo?.devs ?? 0}
              counterProps={{ c: textColor, fz: "md" }}
            />
          </Flex>
        </Stack>
      </Flex>
      <TbChevronDown
        size="30"
        color="var(--mantine-color-gray-3)"
        style={{ paddingTop: "3px", flexShrink: 0 }}
      />
    </Flex>
  );
};
