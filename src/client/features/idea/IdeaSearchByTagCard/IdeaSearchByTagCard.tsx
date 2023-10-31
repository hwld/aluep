import { IdeaTagBadge } from "@/client/features/idea/IdeaTagBadge/IdeaTagBadge";
import { trpc } from "@/client/lib/trpc";
import { EmptyContentItem } from "@/client/ui/EmptyContentItem/EmptyContentItem";
import { Routes } from "@/share/routes";
import { Button, Card, Flex, Group, Stack, Text } from "@mantine/core";
import { SvgArrowRight, SvgTag } from "@tabler/icons-react";
import Link from "next/link";
import classes from "./IdeaSearchByTagCard.module.css";

type Props = {};

export const IdeaSearchByTagCard: React.FC<Props> = () => {
  const { data: popularTags } = trpc.aggregate.getPopularIdeaTags.useQuery(
    { limit: 10 },
    {
      initialData: [],
    }
  );

  return (
    <Card bg="red.7" w="300">
      <Stack>
        <Group justify="space-between">
          <Group gap={5}>
            <SvgTag
              width={20}
              height={20}
              color="var(--mantine-color-gray-1)"
            />
            <Text c="gray.1" fw="bold">
              タグから探す
            </Text>
          </Group>
          <Button
            component={Link}
            href={Routes.ideaSearch()}
            size="xs"
            rightSection={<SvgArrowRight width={14} height={14} />}
            className={classes["search-more-button"]}
          >
            もっと探す
          </Button>
        </Group>
        <Flex
          wrap="wrap"
          bg="gray.1"
          p="md"
          gap="xs"
          style={{ borderRadius: "var(--mantine-radius-md)" }}
        >
          {popularTags.length === 0 ? (
            <EmptyContentItem
              icon={
                <SvgTag
                  width={100}
                  height={100}
                  color="var(--mantine-color-gray-7)"
                />
              }
              text="投稿されたタグがありません"
              description={
                <>
                  タグ付きのお題が投稿されると、タグとお題の数が表示されます。
                </>
              }
            />
          ) : (
            popularTags.slice(0, 10).map((tag) => (
              <IdeaTagBadge
                tagId={tag.id}
                size="lg"
                key={tag.id}
                rightSection={
                  <Flex
                    justify="center"
                    align="center"
                    style={{
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      backgroundColor: "var(--mantine-color-red-0)",
                    }}
                  >
                    {tag.ideaCount}
                  </Flex>
                }
              >
                {tag.name}
              </IdeaTagBadge>
            ))
          )}
        </Flex>
      </Stack>
    </Card>
  );
};
