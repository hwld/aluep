import { UserSection } from "@/client/features/user/UserSection/UserSection";
import { AppTitle } from "@/client/ui/AppTitle/AppTitle";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { Dev } from "@/models/dev";
import { Routes } from "@/share/routes";
import { Center, Flex, Stack, Text } from "@mantine/core";
import { TbCode } from "react-icons/tb";

type Props = { dev: Dev };
export const DevSummaryHeader: React.FC<Props> = ({ dev }) => {
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
        <TextLink href={Routes.dev(dev.id)}>
          <Flex align="flex-end" gap="5">
            <AppTitle order={4} size="h2" truncate>
              {dev.idea.title}
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

        <UserSection
          userIconSrc={dev.developer.imageUrl}
          userId={dev.developer.id}
          title={
            <TextLink href={Routes.user(dev.developer.id)}>
              <Text size="md" truncate>
                {dev.developer.name}
              </Text>
            </TextLink>
          }
        />
      </Stack>
    </Flex>
  );
};
