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
import { Theme } from "../../server/models/theme";
import { UserIconLink } from "./UserIconLink";

/**　アプリ開発のお題の概要カード */
type Props = { theme: Theme };
export const ThemeSummaryCard: React.FC<Props> = ({ theme }) => {
  const mantineTheme = useMantineTheme();
  return (
    <Card>
      <Flex gap="md" align="center">
        <Box sx={{ flexShrink: 0 }}>
          <TbFileText color={mantineTheme.colors.red[7]} size={60} />
        </Box>
        <Stack spacing="sm" miw={0}>
          <Title
            order={4}
            color="red.7"
            sx={() => ({
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            })}
          >
            {theme.title}
          </Title>
          <Flex gap={5} align="center">
            <UserIconLink userId={theme.user.id} iconSrc={theme.user.image} />
            <Text
              size="sm"
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {theme?.user.name}
            </Text>
          </Flex>
        </Stack>
      </Flex>
    </Card>
  );
};
