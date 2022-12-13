import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Flex, Stack } from "@mantine/core";
import { useId } from "react";
import { Controller, useForm } from "react-hook-form";
import { RepositoryFormData, repositoryFormSchema } from "../../share/schema";
import { AppTextarea } from "./AppTextarea";
import { AppTextInput } from "./AppTextInput";

type Props = {
  onSubmit: (data: RepositoryFormData) => void;
  onCancel: () => void;
};
export const RepositoryForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const formId = useId();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RepositoryFormData>({
    defaultValues: { repoName: "", repoDescription: "" },
    resolver: zodResolver(repositoryFormSchema),
  });

  return (
    <>
      <form id={formId} onSubmit={handleSubmit(onSubmit)} />
      <Stack spacing="md">
        <Controller
          control={control}
          name="repoName"
          render={({ field }) => {
            return (
              <AppTextInput
                label="リポジトリ名"
                error={errors.repoName?.message}
                {...field}
              />
            );
          }}
        />
        <Controller
          control={control}
          name="repoDescription"
          render={({ field }) => {
            return (
              <AppTextarea
                label="説明"
                minRows={3}
                error={errors.repoDescription?.message}
                {...field}
              />
            );
          }}
        />
      </Stack>
      <Flex gap="sm" mt="lg">
        <Button type="submit" form={formId}>
          リポジトリを作成する
        </Button>
        <Button variant="outline" onClick={onCancel}>
          キャンセル
        </Button>
      </Flex>
    </>
  );
};
