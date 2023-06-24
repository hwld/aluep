import { UserIconLink } from "@/client/features/user/UserIconLink";
import { TextLink } from "@/client/ui/TextLink";
import { Idea } from "@/models/idea";
import { Routes } from "@/share/routes";
import {
  Box,
  Card,
  Flex,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { TbFileText } from "react-icons/tb";

/**　アプリ開発のお題の概要カード */
type Props = { idea: Idea };

export const IdeaSummaryCard: React.FC<Props> = ({ idea }) => {
  const mantineTheme = useMantineTheme();
  return (
    <Card>
      <Flex gap="md" align="center">
        <Box sx={{ flexShrink: 0 }}>
          <TbFileText color={mantineTheme.colors.red[7]} size={60} />
        </Box>
        <Stack spacing="sm" miw={0}>
          <TextLink href={Routes.idea(idea.id)}>
            <Title order={4} color="red.7" truncate>
              {idea.title}
            </Title>
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
