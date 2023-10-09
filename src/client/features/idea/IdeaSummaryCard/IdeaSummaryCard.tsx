import { UserIconLink } from "@/client/features/user/UserIconLink/UserIconLink";
import { AppTitle } from "@/client/ui/AppTitle/AppTitle";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { Idea } from "@/models/idea";
import { Routes } from "@/share/routes";
import { Box, Card, Flex, Stack, Text } from "@mantine/core";
import { TbFileText } from "react-icons/tb";

/**　アプリ開発のお題の概要カード */
type Props = { idea: Idea };

export const IdeaSummaryCard: React.FC<Props> = ({ idea }) => {
  return (
    <Card>
      <Flex gap="md" align="center">
        <Box style={{ flexShrink: 0 }}>
          <TbFileText color="var(--mantine-color-red-7)" size={60} />
        </Box>
        <Stack gap="sm" miw={0}>
          <TextLink href={Routes.idea(idea.id)}>
            <AppTitle order={4} c="red.7" truncate>
              {idea.title}
            </AppTitle>
          </TextLink>
          <Flex gap={5} align="center">
            <UserIconLink userId={idea.user.id} iconSrc={idea.user.image} />
            <TextLink href={Routes.user(idea.user.id)}>
              <Text size="sm" truncate>
                {idea.user.name}
              </Text>
            </TextLink>
          </Flex>
        </Stack>
      </Flex>
    </Card>
  );
};
