import { DevelopmentMemoChild } from "@/client/features/developmentMemo/DevelopmentMemoChild";
import { useAutoScrollOnIncrease } from "@/client/lib/useAutoScrollOnIncrease";
import { DevelopmentMemo } from "@/models/developmentMemo";
import { Box, Button, Divider, Stack } from "@mantine/core";
import { useRef } from "react";

type Props = {
  ideaId: string;
  developmentId: string;
  childMemos: DevelopmentMemo[];
  isOpenReplyForm: boolean;
  onOpenReplyForm: () => void;
  onCloseReplyForm: () => void;
};
export const ChildDevelopmentMemoSection: React.FC<Props> = ({
  ideaId,
  developmentId,
  childMemos,
  isOpenReplyForm,
  onOpenReplyForm,
  onCloseReplyForm,
}) => {
  const underRef = useRef<HTMLDivElement | null>(null);

  const handleOpenReplyForm = () => {
    onOpenReplyForm();
  };

  useAutoScrollOnIncrease({
    target: underRef,
    count: childMemos.length,
    onAfterScroll: onCloseReplyForm,
    verticalPosition: "center",
  });

  if (childMemos.length === 0) {
    return <></>;
  }

  return (
    <Box mt="sm">
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
        {childMemos.map((memo, i) => {
          const child = (
            <DevelopmentMemoChild
              ideaId={ideaId}
              key={memo.id}
              memo={memo}
              developmentId={developmentId}
            />
          );

          // 最後のメモの上部にBoxを追加して、スクロールできるようにする
          if (childMemos.length - 1 === i) {
            return (
              <Box key={memo.id}>
                <Box ref={underRef} />
                {child}
              </Box>
            );
          } else {
            return child;
          }
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
