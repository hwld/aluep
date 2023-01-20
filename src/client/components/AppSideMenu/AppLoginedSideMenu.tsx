import {
  Card,
  Flex,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { Session } from "next-auth";
import {
  MdOutlineFavoriteBorder,
  MdOutlineTextSnippet,
  MdPersonOutline,
} from "react-icons/md";
import { useSumThemeLikesQuery } from "../../hooks/useSumThemeLikesQuery";
import { useThemeDeveloperLikesQuery } from "../../hooks/useThemeDeveloperLikesQuery";
import { UserMenuButton } from "../AppHeader/UserMenuButton";
import { UserIcon } from "../UserIcon";

type Props = { user: Session["user"]; isMenuOpen: boolean };

export const AppLoginedSideMenu: React.FC<Props> = ({ user, isMenuOpen }) => {
  const mantineTheme = useMantineTheme();
  const { sumThemeLikes } = useSumThemeLikesQuery(user.id);
  const { themeDeveloperLikes } = useThemeDeveloperLikesQuery(user.id);
  const sum = (sumThemeLikes ?? 0) + (themeDeveloperLikes ?? 0);
  return (
    <UserMenuButton user={user}>
      <Card h={110}>
        <Flex align="flex-start" gap={5}>
          <Flex direction="column" sx={{ marginLeft: -12 }} gap={3}>
            <UnstyledButton>
              <UserIcon iconSrc={user.image} withBorder={true} />
            </UnstyledButton>
            {!isMenuOpen && (
              <Flex align="center" direction="column" sx={{ marginTop: 5 }}>
                <MdOutlineFavoriteBorder
                  size="20px"
                  color={mantineTheme.colors.red[7]}
                />
                <Text size={14} align="center" sx={{ marginTop: -5 }}>
                  {sum}
                </Text>
              </Flex>
            )}
          </Flex>

          <Flex direction="column" gap={20}>
            <Flex w={230}>
              <Text
                size={15}
                sx={() => {
                  return {
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  };
                }}
              >
                {user.name}
              </Text>
            </Flex>

            <Flex gap={10}>
              <Flex gap={5}>
                <MdOutlineTextSnippet size={25} style={{ marginTop: "4px" }} />
                <Text size={20}>{sumThemeLikes}</Text>
              </Flex>

              <Flex gap={5}>
                <MdPersonOutline size={25} style={{ marginTop: "4px" }} />
                <Text size={20}>{themeDeveloperLikes}</Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </UserMenuButton>
  );
};
