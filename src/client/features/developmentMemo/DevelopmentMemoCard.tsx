import {
  Box,
  Button,
  Card,
  Flex,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { FaRegComment } from "react-icons/fa";
import { DevelopmentMemo } from "../../../server/models/developmentMemo";
import { DevelopmentMemoFormData } from "../../../share/schema";
import { formatDate } from "../../lib/utils";
import { CardActionIcon } from "../../ui/CardActionIcon";
import { UserIconLink } from "../user/UserIconLink";
import { ChildDevelopmentMemoSection } from "./ChildDevelopmentMemoSection";

type Props = {
  developmentId: string;
  onDeleteMemo: (id: string) => void;
  memo: DevelopmentMemo;
  childrenMemos: DevelopmentMemo[];
  onSubmitMemo: (data: DevelopmentMemoFormData) => void;
  isSubmittingMemo?: boolean;
};
export const DevelopmentMemoCard: React.FC<Props> = ({
  developmentId,
  memo,
  childrenMemos,
  onDeleteMemo,
  onSubmitMemo,
  isSubmittingMemo,
}) => {
  const { colors } = useMantineTheme();

  const handleDeleteMemo = () => {
    onDeleteMemo(memo.id);
  };

  return (
    <Card>
      <Stack spacing="md">
        <Flex justify="space-between">
          <Flex align="center" gap="xs">
            <UserIconLink
              userId={memo.fromUser.id}
              iconSrc={memo.fromUser.imageUrl}
            />
            <Text c="gray.5" size="xs">
              {memo.fromUser.name}
            </Text>
          </Flex>
          <Button onClick={handleDeleteMemo}>削除</Button>
        </Flex>
        <Text sx={{ whiteSpace: "pre-line" }}>{memo.memo}</Text>
        <Flex justify="space-between" align="center">
          <CardActionIcon>
            <FaRegComment color={colors.gray[5]} size={20} />
          </CardActionIcon>
          <Text c="gray.5">{formatDate(memo.createdAt)}</Text>
        </Flex>
      </Stack>
      {childrenMemos.length > 0 && (
        <Box mt="sm">
          <ChildDevelopmentMemoSection
            developmentId={developmentId}
            childMemos={childrenMemos}
            onSubmitReply={onSubmitMemo}
            isSubmittingReply={isSubmittingMemo}
          />
        </Box>
      )}
    </Card>
  );
};
