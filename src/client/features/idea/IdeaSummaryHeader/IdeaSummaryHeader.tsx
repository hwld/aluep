import { UserIconLink } from "@/client/features/user/UserIconLink/UserIconLink";
import { AppTitle } from "@/client/ui/AppTitle/AppTitle";
import { SvgFileText } from "@/client/ui/Icons";
import { MutedText } from "@/client/ui/MutedText/MutedText";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { Idea } from "@/models/idea";
import { Routes } from "@/share/routes";
import { Center, Flex, Stack, Text } from "@mantine/core";

type Props = { idea: Idea | undefined };

export const IdeaSummaryHeader: React.FC<Props> = ({ idea }) => {
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
        <SvgFileText
          color={
            idea ? "var(--mantine-color-red-7)" : "var(--mantine-color-gray-5)"
          }
          width={70}
          height={70}
        />
      </Center>
      <Stack gap="md" miw={0}>
        {idea ? (
          <>
            <TextLink href={Routes.idea(idea.id)}>
              <AppTitle order={4} size="h2" c="red.7" truncate>
                {idea.title}
              </AppTitle>
            </TextLink>
            <Flex gap="xs" align="center">
              <UserIconLink
                size="md"
                userId={idea.user.id}
                iconSrc={idea.user.image}
              />
              <TextLink href={Routes.user(idea.user.id)}>
                <Text size="md" truncate>
                  {idea.user.name}
                </Text>
              </TextLink>
            </Flex>
          </>
        ) : (
          <>
            <AppTitle order={4} size="h3" c="gray.5" truncate>
              削除されたお題
            </AppTitle>
            <MutedText>
              お題が削除されています。
              <br />
              お題のタイトルやお題の投稿者を表示できません。
            </MutedText>
          </>
        )}
      </Stack>
    </Flex>
  );
};
