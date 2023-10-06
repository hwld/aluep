import { UserIconLink } from "@/client/features/user/UserIconLink/UserIconLink";
import { useSamePositionLeftClick } from "@/client/lib/useSamePositionLeftClick";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { Idea } from "@/models/idea";
import { Routes } from "@/share/routes";
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
import classes from "./PopularIdeaCard.module.css";

export const popularIdeaCardWidthPx = 400;
export const PopularIdeaCard: React.FC<{ idea: Idea }> = ({ idea }) => {
  const router = useRouter();
  const mantineTheme = useMantineTheme();

  // ただのクリックで処理するとカルーセルの移動で発火してしまうので
  // mouseDownと同じ位置でmouseUpが発火されたときに処理する
  const { setLeftClickPosition, isSameLeftClickPosition, resetPosition } =
    useSamePositionLeftClick();

  const handleMouseUp: MouseEventHandler = (e) => {
    if (isSameLeftClickPosition(e)) {
      resetPosition();
      router.push(Routes.idea(idea.id));
    }
    resetPosition();
  };

  return (
    <Card
      key={idea.id}
      miw={popularIdeaCardWidthPx}
      h="100%"
      className={classes.root}
      onMouseDown={setLeftClickPosition}
      onMouseUp={handleMouseUp}
      onMouseLeave={resetPosition}
    >
      <Stack justify="space-between" h="100%">
        {/* ヘッダ */}
        <Box
          style={{
            flexShrink: 1,
            minHeight: 0,
            display: "-webkit-box",
            WebkitLineClamp: 5,
            WebkitBoxOrient: "vertical",
          }}
        >
          <TextLink
            href={Routes.idea(idea.id)}
            className={classes["idea-link"]}
          >
            <Title
              order={4}
              c="red.7"
              style={{ lineHeight: 1.2, wordBreak: "break-all" }}
            >
              {idea.title}
            </Title>
          </TextLink>
        </Box>

        <Group justify="space-between" wrap="nowrap">
          {/* ユーザー情報 */}
          <Flex
            miw={0}
            gap={5}
            style={{ alignSelf: "flex-end", flexShrink: 1 }}
          >
            <UserIconLink userId={idea.user.id} iconSrc={idea.user.image} />
            <Flex direction="column" miw={0} style={{ flexShrink: 1 }}>
              <TextLink href={Routes.user(idea.user.id)}>
                <Text size="xs" truncate>
                  {idea.user.name}
                </Text>
              </TextLink>
              <Flex align="center" gap="sm">
                <Text c="gray.5" size="xs" style={{ whiteSpace: "nowrap" }}>
                  {idea.elapsedSinceCreation}
                </Text>
                <Flex align="center" gap={3}>
                  <MdComputer size="15px" color={mantineTheme.colors.red[7]} />
                  <Text size="xs" c="red.7">
                    {idea.developments}
                  </Text>
                </Flex>
                <Flex align="center" gap={3}>
                  <FaRegComment
                    size="15px"
                    color={mantineTheme.colors.red[7]}
                  />
                  <Text size="xs" c="red.7">
                    {idea.comments}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>

          {/* いいね数 */}
          <Flex justify="flex-end" align="flex-end" gap="xs">
            <Flex align="center" gap={5}>
              <TbHeart
                size="55px"
                color="transparent"
                fill={mantineTheme.colors.red[7]}
              />
              <Text
                size="xl"
                fw="bold"
                c="red.7"
                style={{ fontSize: "25px", whiteSpace: "nowrap" }}
              >
                {idea.likes}
              </Text>
            </Flex>
          </Flex>
        </Group>
      </Stack>
    </Card>
  );
};
