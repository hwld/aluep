import {
  Flex,
  Stack,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { Session } from "next-auth";
import { TbChevronDown, TbCode, TbFileText, TbHeart } from "react-icons/tb";
import { useLoggedInUserInfoQuery } from "../../hooks/useLoggedInUserInfoQuery";
import { UserIcon } from "../UserIcon";

type Props = { user: Session["user"]; iconWidth: number };

export const AppLoginedSideMenu: React.FC<Props> = ({ user, iconWidth }) => {
  const { colors } = useMantineTheme();
  //  TODO: ユーザーの情報を取得するためにいろんなAPIを呼んでいる。
  // 全ての情報を取得する一つのAPIを作ったほうがよさそう。
  const { loggedInUserInfo } = useLoggedInUserInfoQuery(user.id);

  return (
    <Flex
      w="100%"
      gap="xs"
      align="center"
      justify="space-between"
      sx={() => ({
        overflow: "hidden",
      })}
    >
      <Flex gap="xs">
        <Stack sx={() => ({ flexShrink: 0 })}>
          <UserIcon size={iconWidth} iconSrc={user.image} withBorder={true} />
        </Stack>
        <Stack
          sx={() => ({
            flexShrink: 1,
            flexWrap: "nowrap",
            overflow: "hidden",
          })}
          spacing="xs"
        >
          <Text
            c="gray.1"
            fw="bold"
            size="sm"
            sx={() => ({
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            })}
          >
            {user.name}
          </Text>
          {/* アイコン類 */}
          <Flex gap="xs">
            <Flex gap="2px" align="center">
              <TbHeart size="20" color={colors.gray[1]} />
              <Text
                size="xs"
                color={colors.gray[1]}
                sx={() => ({
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                })}
              >
                {loggedInUserInfo?.allLikes ?? 0}
              </Text>
            </Flex>

            <Flex gap="2px" align="center">
              <TbFileText size="20" color={colors.gray[1]} />
              <Text
                size="xs"
                color={colors.gray[1]}
                sx={() => ({
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                })}
              >
                {loggedInUserInfo?.themes ?? 0}
              </Text>
            </Flex>

            <Flex gap="2px" align="center">
              <TbCode size="20" color={colors.gray[1]} />
              <Text
                size="xs"
                color={colors.gray[1]}
                sx={() => ({
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                })}
              >
                {loggedInUserInfo?.developers ?? 0}
              </Text>
            </Flex>
          </Flex>
        </Stack>
      </Flex>
      <UnstyledButton
        sx={(theme) => ({
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "background-color 150ms",
          "&:hover": {
            backgroundColor: theme.fn.rgba("#000", 0.1),
          },
        })}
      >
        <TbChevronDown
          size="45"
          color={colors.gray[3]}
          style={{ paddingTop: "3px" }}
        />
      </UnstyledButton>
    </Flex>
  );
};
