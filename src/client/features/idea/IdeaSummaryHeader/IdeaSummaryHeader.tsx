import { UserIconLink } from "@/client/features/user/UserIconLink/UserIconLink";
import { AppTitle } from "@/client/ui/AppTitle/AppTitle";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { Idea } from "@/models/idea";
import { Routes } from "@/share/routes";
import { Center, Flex, Stack, Text } from "@mantine/core";
import { TbFileText } from "react-icons/tb";

type Props = { idea: Idea };

export const IdeaSummaryHeader: React.FC<Props> = ({ idea }) => {
  return (
    <Flex gap="md" align="center">
      <Center
        style={{
          flexShrink: 0,
          backgroundColor: "var(--mantine-color-gray-1)",
          borderRadius: "10px",
          padding: "var(--mantine-spacing-xs)",
        }}
      >
        <TbFileText color="var(--mantine-color-red-7)" size={70} />
      </Center>
      <Stack gap="md" miw={0}>
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
      </Stack>
    </Flex>
  );
};
