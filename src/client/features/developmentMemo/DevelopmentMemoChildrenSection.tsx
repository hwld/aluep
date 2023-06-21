import { Box, Button, Divider, Stack } from "@mantine/core";
import { DevelopmentMemo } from "../../../server/models/developmentMemo";
import { DevelopmentMemoChild } from "./DevelopmentMemoChild";

type Props = {
  ideaId: string;
  developmentId: string;
  childMemos: DevelopmentMemo[];
  isOpenReplyForm: boolean;
  onOpenReplyForm: () => void;
};
export const ChildDevelopmentMemoSection: React.FC<Props> = ({
  ideaId,
  developmentId,
  childMemos,
  isOpenReplyForm,
  onOpenReplyForm,
}) => {
  const handleOpenReplyForm = () => {
    onOpenReplyForm();
  };

  return (
    <Box>
      <Divider></Divider>
      <Stack
        spacing="xl"
        py="md"
        sx={(theme) => ({
          position: "relative",
          "&:before": {
            content: '""',
            position: "absolute",
            top: "20px",
            bottom: "0",
            left: "17px",
            width: "2px",
            background: theme.colors.gray[3],
          },
        })}
      >
        {childMemos.map((memo) => {
          return (
            <DevelopmentMemoChild
              ideaId={ideaId}
              key={memo.id}
              memo={memo}
              developmentId={developmentId}
            />
          );
        })}
      </Stack>
      {!isOpenReplyForm && (
        <Button
          variant="outline"
          color="gray.5"
          sx={(theme) => ({
            transition: "background-color 250ms",
            "&:hover": { backgroundColor: theme.colors.gray[2] },
          })}
          onClick={handleOpenReplyForm}
        >
          返信する
        </Button>
      )}
    </Box>
  );
};
