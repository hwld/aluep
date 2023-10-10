import { UserIconLink } from "@/client/features/user/UserIconLink/UserIconLink";
import { AppTitle } from "@/client/ui/AppTitle/AppTitle";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { Development } from "@/models/development";
import { Routes } from "@/share/routes";
import { Center, Flex, Stack, Text } from "@mantine/core";
import { TbCode } from "react-icons/tb";

type Props = { development: Development };
export const DevSummaryHeader: React.FC<Props> = ({ development }) => {
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
        <TbCode color="var(--mantine-color-red-7)" size={70} />
      </Center>
      <Stack gap="md" miw={0}>
        <TextLink href={Routes.development(development.ideaId, development.id)}>
          <Flex align="flex-end" gap="5">
            <AppTitle order={4} size="h2" truncate>
              {development.ideaTitle}
            </AppTitle>
            <Text
              span
              c="red.7"
              size="lg"
              fw="bold"
              style={{ whiteSpace: "nowrap" }}
            >
              {"の開発情報"}
            </Text>
          </Flex>
        </TextLink>
        <Flex gap="xs" align="center">
          <UserIconLink
            size="md"
            userId={development.developer.id}
            iconSrc={development.developer.imageUrl}
          />
          <TextLink href={Routes.user(development.developer.id)}>
            <Text size="md" truncate>
              {development.developer.name}
            </Text>
          </TextLink>
        </Flex>
      </Stack>
    </Flex>
  );
};
