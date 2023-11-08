import { useDebouncedValue } from "@mantine/hooks";
import { FormEvent, FormEventHandler } from "react";

type UseAppFormArgs = {
  isSubmitting: boolean;
  wait?: number;
  onCancel?: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

/**
 *指定された秒数までフォームのSubmittingを遅延させるHook。
 *送信、キャンセルボタンのローディングを遅延させるために使用している。
 *Submittingがtrueであればローディングが表示されていなくてもキャンセル・送信はブロックするので、
 *onSubmitとonCancelを受け取る
 */
export const useDebouncedSubmitting = ({
  isSubmitting,
  wait = 250,
  onCancel,
  onSubmit,
}: UseAppFormArgs) => {
  // すぐに終わる操作で一瞬インジケータが表示されるのを防ぐために、
  // isSubmittingが変更されてから250ms経過した後に反映させる。
  // ただ、その間にキャンセルボタンやSubmitボタンを押されたくないので、
  // スタイルには反映させないが、内部的には押しても何も起こらないようにする。
  const [debouncedSubmitting] = useDebouncedValue(isSubmitting, wait);

  const handleCancel = () => {
    if (!isSubmitting) {
      onCancel?.();
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!isSubmitting) {
      onSubmit(e);
    }
  };

  return { debouncedSubmitting, handleCancel, handleSubmit };
};
