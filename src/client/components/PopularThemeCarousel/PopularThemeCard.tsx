import {
  Box,
  Card,
  Flex,
  Group,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useRouter } from "next/router";
import { MouseEventHandler } from "react";
import { FaRegComment } from "react-icons/fa";
import { MdComputer } from "react-icons/md";
import { TbHeart } from "react-icons/tb";
import { Theme } from "../../../server/models/theme";
import { useSamePositionLeftClick } from "../../hooks/useSamePositionLeftClick";
import { TextLink } from "../TextLink";
import { UserIconLink } from "../UserIconLink";

export const popularThemeCardWidthPx = 400;
export const PopularThemeCard: React.FC<{ theme: Theme }> = ({ theme }) => {
  const router = useRouter();
  const mantineTheme = useMantineTheme();

  // ただのクリックで処理するとカルーセルの移動で発火してしまうので
  // mouseDownと同じ位置でmouseUpが発火されたときに処理する
  const { setLeftClickPosition, isSameLeftClickPosition, resetPosition } =
    useSamePositionLeftClick();

  const handleMouseUp: MouseEventHandler = (e) => {
    if (isSameLeftClickPosition(e)) {
      resetPosition();
      router.push(`/themes/${theme.id}`);
    }
    resetPosition();
  };

  return (
    <Card
      key={theme.id}
      miw={popularThemeCardWidthPx}
      h="100%"
      sx={(theme) => ({
        cursor: "pointer",
        position: "static",
        transition: "all 150ms",
        "&:hover": {
          boxShadow: `${theme.shadows.lg}, 0 0 0 2px ${theme.colors.red[7]}`,
        },
      })}
      onMouseDown={setLeftClickPosition}
      onMouseUp={handleMouseUp}
      onMouseLeave={resetPosition}
    >
      <Stack justify="space-between" h="100%">
        {/* ヘッダ */}
        <Box
          sx={{
            flexShrink: 1,
            minHeight: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 5,
            WebkitBoxOrient: "vertical",
          }}
        >
          <TextLink href={`/themes/${theme.id}`}>
            <Title
              order={4}
              color="red.7"
              sx={{
                lineHeight: 1.2,
              }}
            >
              {theme.title}
            </Title>
          </TextLink>
        </Box>

        <Group position="apart" noWrap>
          {/* ユーザー情報 */}
          <Flex miw={0} gap={5} sx={{ alignSelf: "flex-end", flexShrink: 1 }}>
            <UserIconLink userId={theme.user.id} iconSrc={theme.user.image} />
            <Flex direction="column" miw={0} sx={{ flexShrink: 1 }}>
              <Text
                size="xs"
                sx={{
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {theme.user.name}
              </Text>
              <Flex align="center" gap="sm">
                <Text
                  color="gray.5"
                  size="xs"
                  sx={{
                    whiteSpace: "nowrap",
                  }}
                >
                  {theme.elapsedSinceCreation}
                </Text>
                <Flex align="center" gap={3}>
                  <MdComputer size="15px" color={mantineTheme.colors.red[7]} />
                  <Text size="xs" c="red.7">
                    {theme.developers}
                  </Text>
                </Flex>
                <Flex align="center" gap={3}>
                  <FaRegComment
                    size="15px"
                    color={mantineTheme.colors.red[7]}
                  />
                  <Text size="xs" c="red.7">
                    {theme.comments}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>

          {/* いいね数 */}
          <Flex justify="flex-end" align="flex-end" gap={"xs"}>
            <Flex align="center" gap={5}>
              <TbHeart
                size="50px"
                color={mantineTheme.colors.red[7]}
                fill={mantineTheme.colors.red[7]}
              />
              <Text
                size={25}
                fw="bold"
                c="red.7"
                style={{ whiteSpace: "nowrap" }}
              >
                {theme.likes}
              </Text>
            </Flex>
          </Flex>
        </Group>
      </Stack>
    </Card>
  );
};
