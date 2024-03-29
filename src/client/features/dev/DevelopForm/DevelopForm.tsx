import { DevStatusSelect } from "@/client/features/dev/DevStatusSelect/DevStatusSelect";
import { trpc } from "@/client/lib/trpc";
import { AppForm } from "@/client/ui/AppForm/AppForm";
import { GitHubRepoSelect } from "@/client/ui/GitHubRepoSelect/GitHubRepoSelect";
import { DevFormData, devFormSchema } from "@/models/dev";
import { DistributiveOmit } from "@emotion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Group, Textarea, TextInput } from "@mantine/core";
import { IconCode } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { UnionToIntersection } from "react-hook-form/dist/types/path/common";

type DevFormDefaultValues = Partial<
  UnionToIntersection<DistributiveOmit<DevFormData, "type">>
>;

type Props = {
  /**
   * 非制御コンポーネントから制御コンポーネントに変わったというエラーを出さないためにstring型のフィールドには
   * 文字列を入れる。
   */
  defaultValues?: DevFormDefaultValues;
  onSubmit: (data: DevFormData) => void;
  onCancel: () => void;
  submitText: string;
  isLoading?: boolean;
};

export const DevelopForm: React.FC<Props> = ({
  defaultValues,
  onSubmit,
  onCancel,
  submitText,
  isLoading,
}) => {
  const { data: repositories } = trpc.me.getMyGitHubRepositories.useQuery(
    undefined,
    { initialData: [] }
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
    getFieldState,
  } = useForm<DevFormData>({
    defaultValues: {
      ...defaultValues,
    },
    resolver: zodResolver(devFormSchema),
  });

  const utils = trpc.useUtils();
  const handleReloadRepositories = () => {
    utils.me.getMyGitHubRepositories.refetch();
  };

  return (
    <AppForm
      onSubmit={handleSubmit(onSubmit)}
      onCancel={onCancel}
      submitIcon={IconCode}
      submitText={submitText}
      isSubmitting={isLoading}
    >
      <Controller
        control={control}
        name="title"
        render={({ field }) => {
          return (
            <TextInput
              label="プロジェクト名"
              error={getFieldState("title").error?.message}
              {...field}
            />
          );
        }}
      />

      <Group align="flex-end" gap="xs">
        <Box style={{ flexGrow: 1 }}>
          <Controller
            control={control}
            name="githubRepositoryUrl"
            render={({ field }) => {
              return (
                <GitHubRepoSelect
                  label="開発に使用するGitHubリポジトリ"
                  onUpdateList={handleReloadRepositories}
                  repositories={repositories}
                  error={getFieldState("githubRepositoryUrl").invalid}
                  {...field}
                />
              );
            }}
          />
        </Box>
        <Button component={Link} href="https://github.com/new" target="_blank">
          作成
        </Button>
      </Group>

      <Controller
        control={control}
        name="status"
        render={({ field }) => {
          return (
            <DevStatusSelect
              {...field}
              error={getFieldState("status").invalid}
            />
          );
        }}
      />

      <Controller
        control={control}
        name="comment"
        render={({ field }) => {
          return (
            <Textarea
              label="コメント"
              styles={{ input: { height: "100px" } }}
              error={errors.comment?.message}
              {...field}
            />
          );
        }}
      />

      <Controller
        control={control}
        name="developedItemUrl"
        render={({ field }) => {
          return (
            <TextInput
              label="成果物のURL"
              error={getFieldState("developedItemUrl").error?.message}
              {...field}
            />
          );
        }}
      />
    </AppForm>
  );
};
