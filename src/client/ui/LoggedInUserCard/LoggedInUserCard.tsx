import { useLoggedInUserInfoQuery } from "@/client/features/session/useLoggedInUserInfoQuery";
import { UserIcon } from "@/client/features/user/UserIcon/UserIcon";
import { Flex, Stack, Text } from "@mantine/core";
import { Session } from "next-auth";
import { TbChevronDown, TbCode, TbFileText, TbHeart } from "react-icons/tb";
import classes from "./LoggedInUserCard.module.css";

type Props = { user: Session["user"]; iconWidth: number };

export const LoggedInUserCard: React.FC<Props> = ({ user, iconWidth }) => {
  const { loggedInUserInfo } = useLoggedInUserInfoQuery();
  const textColor = "var(--mantine-color-gray-1)";

  return (
    <Flex
      w="100%"
      align="center"
      justify="space-between"
      className={classes.root}
    >
      <Flex gap="xs" miw="0">
        <Stack className={classes["user-icon-wrapper"]}>
          <UserIcon size={iconWidth} iconSrc={user.image} withBorder={true} />
        </Stack>
        <Stack className={classes["card-content"]} gap="xs">
          <Text c="gray.1" fw="bold" size="sm" truncate>
            {user.name}
          </Text>
          {/* アイコン類 */}
          <Flex gap="xs">
            <Flex gap="2px" align="center">
              <TbHeart size="20" color={textColor} />
              <Text size="sm" c={textColor} truncate>
                {loggedInUserInfo?.allLikes ?? 0}
              </Text>
            </Flex>

            <Flex gap="2px" align="center">
              <TbFileText size="20" color={textColor} />
              <Text size="sm" c={textColor} truncate>
                {loggedInUserInfo?.ideas ?? 0}
              </Text>
            </Flex>

            <Flex gap="2px" align="center">
              <TbCode size="20" color={textColor} />
              <Text size="sm" c={textColor} truncate>
                {loggedInUserInfo?.devs ?? 0}
              </Text>
            </Flex>
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
