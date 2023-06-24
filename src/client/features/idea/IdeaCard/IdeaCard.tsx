import { IdeaTagBadge } from "@/client/features/idea/IdeaTagBadge";
import { UserIconLink } from "@/client/features/user/UserIconLink";
import { TextLink } from "@/client/ui/TextLink";
import { Idea } from "@/models/idea";
import { Routes } from "@/share/routes";
import { Card, Flex, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { useRouter } from "next/router";
import { FaRegComment } from "react-icons/fa";
import { MdComputer } from "react-icons/md";
import { TbHeart } from "react-icons/tb";

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
        transition: "all 100ms",
        outline: "transparent solid 0px",
        "&:not(:has(a:not(.idea-link):hover, button:hover)):hover": {
          outline: `${theme.colors.red[6]} solid 2px`,
          outlineOffset: "3px",
        },
      })}
      onClick={handleGoIdeaDetail}
    >
      <Stack spacing={10} miw={0}>
        {/* ヘッダ */}
        <Flex justify="space-between" align="flex-start" gap={10} miw={0}>
          <TextLink href={Routes.idea(idea.id)} className="idea-link">
            <Title
              order={3}
              color="red.7"
              sx={{ lineHeight: 1.4, wordBreak: "break-all" }}
            >
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
              <Text size="sm" truncate>
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
