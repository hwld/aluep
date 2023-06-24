import { UserIconLink } from "@/client/features/user/UserIconLink";
import { TextLink } from "@/client/ui/TextLink";
import { Development } from "@/models/development";
import { Routes } from "@/share/routes";
import { Box, Card, Flex, Stack, Text, useMantineTheme } from "@mantine/core";
import { TbFileText } from "react-icons/tb";

type Props = { development: Development };
export const DevelopmentSummaryCard: React.FC<Props> = ({ development }) => {
  const { colors } = useMantineTheme();

  return (
    <Card miw={450}>
      <Stack spacing={5}>
        <Flex gap={5}>
          <Box sx={{ flexShrink: 0 }}>
            <TbFileText color={colors.red[7]} size={30} />
          </Box>
          <TextLink
            href={Routes.development(development.ideaId, development.id)}
          >
            <Text>
              {development.ideaTitle}
              <br></br>
              <Text span color="red.7" size="lg">
                {"  の開発情報"}
              </Text>
            </Text>
          </TextLink>
        </Flex>
        <Flex align="center" gap={5}>
          <UserIconLink
            userId={development.developerUserId}
            iconSrc={development.developerUserImage}
          />
          <TextLink href={Routes.user(development.developerUserId)}>
            <Text>{development.developerUserName}</Text>
          </TextLink>
        </Flex>
      </Stack>
    </Card>
  );
};
