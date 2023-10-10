import { UserIconLink } from "@/client/features/user/UserIconLink/UserIconLink";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { Development } from "@/models/development";
import { Routes } from "@/share/routes";
import { Box, Card, Flex, Stack, Text } from "@mantine/core";
import { TbFileText } from "react-icons/tb";
import classes from "./DevSummaryCard.module.css";

type Props = { development: Development };
export const DevSummaryCard: React.FC<Props> = ({ development }) => {
  return (
    <Card miw={450}>
      <Stack gap={5}>
        <Flex gap={5}>
          <Box className={classes["icon-wrapper"]}>
            <TbFileText color="var(--mantine-color-red-7)" size={30} />
          </Box>
          <TextLink
            href={Routes.development(development.ideaId, development.id)}
          >
            <Text fw="bold" truncate>
              {development.ideaTitle}
              <br></br>
              <Text span c="red.7" size="lg">
                {"  の開発情報"}
              </Text>
            </Text>
          </TextLink>
        </Flex>
        <Flex align="center" gap={5}>
          <UserIconLink
            userId={development.developer.id}
            iconSrc={development.developer.imageUrl}
          />
          <TextLink href={Routes.user(development.developer.id)}>
            <Text c="gray.5" size="sm" truncate>
              {development.developer.name}
            </Text>
          </TextLink>
        </Flex>
      </Stack>
    </Card>
  );
};
