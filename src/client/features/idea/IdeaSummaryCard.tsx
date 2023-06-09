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
import { Idea } from "../../../server/models/idea";
import { Routes } from "../../../share/routes";
import { TextLink } from "../../ui/TextLink";
import { UserIconLink } from "../user/UserIconLink";

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
            <Title
              order={4}
              color="red.7"
              sx={() => ({
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              })}
            >
              {idea.title}
            </Title>
          </TextLink>
          <Flex gap={5} align="center">
            <UserIconLink userId={idea.user.id} iconSrc={idea.user.image} />
            <Text
              size="sm"
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {/* TODO: ここもリンクにしたい */}
              {idea?.user.name}
            </Text>
          </Flex>
        </Stack>
      </Flex>
    </Card>
  );
};
