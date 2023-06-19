import { Box, Card, Flex, Text, Title } from "@mantine/core";
import { Development } from "../../../server/models/development";
import { Routes } from "../../../share/routes";
import { TextLink } from "../../ui/TextLink";
import { UserIconLink } from "../user/UserIconLink";
import { DevelopmentMenuButton } from "./DevelopmentMenuButton";

type Props = { development: Development; isLoggedInUserDeveloper: boolean };
export const DeveloperCard: React.FC<Props> = ({
  development,
  isLoggedInUserDeveloper,
}) => {
  return (
    <Card w="100%" h="100%" p="xl">
      <Box>
        <Box sx={{ position: "absolute", top: 10, right: 10 }}>
          <DevelopmentMenuButton
            development={development}
            isOwner={isLoggedInUserDeveloper}
          />
        </Box>
        <Flex mt="sm" gap="xs" align="center">
          <UserIconLink
            userId={development.developerUserId}
            iconSrc={development.developerUserImage}
            size="lg"
          />
          <TextLink
            href={Routes.user(development.developerUserId)}
            height="min-content"
          >
            <Title truncate size={18} miw={0}>
              {development.developerUserName}
            </Title>
          </TextLink>
        </Flex>
        <Box
          mt="sm"
          h={100}
          w="100%"
          bg="gray.2"
          p="sm"
          sx={{ borderRadius: "5px", overflow: "auto" }}
        >
          {!development.comment ? (
            <Text c="gray.4">コメントはありません</Text>
          ) : (
            <Text size="sm">{development.comment}</Text>
          )}
        </Box>
      </Box>
    </Card>
  );
};
