import { Card, Flex, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { useRouter } from "next/router";
import { FaRegComment } from "react-icons/fa";
import { MdComputer } from "react-icons/md";
import { TbHeart } from "react-icons/tb";
import { Idea } from "../../../../server/models/idea";
import { Routes } from "../../../../share/routes";
import { TextLink } from "../../../ui/TextLink";
import { UserIconLink } from "../../user/UserIconLink";
import { IdeaTagBadge } from "../IdeaTagBadge";

export const ideaCardMinWidthPx = 450;

type Props = { idea: Idea };
export const IdeaCard: React.FC<Props> = ({ idea }) => {
  const router = useRouter();
  const mantineTheme = useMantineTheme();

  const handleGoIdeaDetail = () => {
    router.push(Routes.idea(idea.id));
  };

  return (
    <Card
      miw={ideaCardMinWidthPx}
      w="100%"
      h="100%"
      sx={(theme) => ({
        cursor: "pointer",
        position: "static",
        transition: "all 150ms",
        // アイコン、タグバッジをホバーしたときにスタイルを当てたくないのでaria-label='user-icon'|'tag-badge'の要素を使っているが、
        // UserIcon, IdeaTagBadgeが変わったときにスタイルが当たらなくなりそう
        "&:not(:has(*[data-user-icon]:hover,*[aria-label='tag-badge']:hover)):hover":
          {
            boxShadow: `${theme.shadows.lg}, 0 0 0 2px ${theme.colors.red[7]}`,
          },
      })}
      onClick={handleGoIdeaDetail}
    >
      <Stack spacing={10} miw={0}>
        {/* ヘッダ */}
        <Flex justify="space-between" align="flex-start" gap={10} miw={0}>
          <TextLink href={Routes.idea(idea.id)}>
            <Title order={3} color="red.7" sx={{ lineHeight: 1.4 }}>
              {idea.title}
            </Title>
          </TextLink>
        </Flex>

        {/* ユーザー情報 */}
        <Flex gap={10}>
          <UserIconLink iconSrc={idea.user.image} userId={idea.user.id} />
          <Flex
            direction="column"
            justify="center"
            sx={{ overflow: "hidden" }}
            miw={0}
          >
            <TextLink href={Routes.idea(idea.id)}>
              <Text
                size="sm"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {idea.user.name}
              </Text>
            </TextLink>
            <Flex align="center" gap="lg">
              <Text color="gray.5" size="sm" sx={{ whiteSpace: "nowrap" }}>
                {idea.elapsedSinceCreation}
              </Text>
              <Flex align="center" gap="sm">
                <Flex align="center" gap={3}>
                  <TbHeart size="16px" color={mantineTheme.colors.red[7]} />
                  <Text size="xs" c="red.7">
                    {idea.likes}
                  </Text>
                </Flex>
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
        </Flex>

        {/* タグ */}
        <Flex gap={5} wrap="wrap" miw={0}>
          {idea.tags.map((tag) => {
            return (
              <IdeaTagBadge tagId={tag.id} size="md" key={tag.id}>
                {tag.name}
              </IdeaTagBadge>
            );
          })}
        </Flex>
      </Stack>
    </Card>
  );
};
