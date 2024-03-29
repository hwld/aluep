import { DevMemoChild } from "@/client/features/devMemo/DevMemoThreadCard/DevMemoChildrenSection/DevMemoChild/DevMemoChild";
import { useAutoScrollOnIncrease } from "@/client/lib/useAutoScrollOnIncrease";
import { DevMemo } from "@/models/devMemo";
import { Box, Button, Divider, Stack } from "@mantine/core";
import { useRef } from "react";
import classes from "./DevMemoChildrenSection.module.css";

type Props = {
  devId: string;
  childMemos: DevMemo[];
  isOpenReplyForm: boolean;
  onOpenReplyForm: () => void;
  onCloseReplyForm: () => void;
};
export const DevMemoChildrenSection: React.FC<Props> = ({
  devId,
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
      <Stack gap="xl" py="md" className={classes.root}>
        {childMemos.map((memo, i) => {
          const child = (
            <DevMemoChild key={memo.id} memo={memo} devId={devId} />
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
          className={classes["reply-button"]}
          onClick={handleOpenReplyForm}
        >
          返信する
        </Button>
      )}
    </Box>
  );
};
