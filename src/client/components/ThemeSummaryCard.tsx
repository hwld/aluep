import {
  Avatar,
  Box,
  Card,
  Flex,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { RiFileList2Line } from "react-icons/ri";
import { Theme } from "../../server/models/theme";

/**　アプリ開発のお題の概要カード */
type Props = { theme: Theme };
export const ThemeSummaryCard: React.FC<Props> = ({ theme }) => {
  const mantineTheme = useMantineTheme();
  return (
    <Card>
      <Flex gap="md" align="center">
        <Box sx={{ flexShrink: 0 }}>
          <RiFileList2Line color={mantineTheme.colors.red[7]} size={70} />
        </Box>
        <Stack spacing="md">
          <Title order={2} color="red.7">
            {theme.title}
          </Title>
          <Flex gap={5}>
            <Avatar
              src={theme.user.image}
              size="md"
              radius={100}
              sx={(theme) => ({
                borderWidth: "2px",
                borderColor: theme.colors.gray[2],
                borderStyle: "solid",
                borderRadius: "100%",
              })}
            />
            <Text>{theme?.user.name}</Text>
          </Flex>
        </Stack>
      </Flex>
    </Card>
  );
};
