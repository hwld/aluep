import { useDevStatusesQuery } from "@/client/features/dev/useDevStatusesQuery";
import { trpc } from "@/client/lib/trpc";
import { AppForm } from "@/client/ui/AppForm/AppForm";
import { GitHubRepoSelect } from "@/client/ui/GitHubRepoSelect/GitHubRepoSelect";
import {
  DevelopmentFormData,
  developmentFormSchema,
} from "@/models/development";
import { DistributiveOmit } from "@emotion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Group, Select, Textarea, TextInput } from "@mantine/core";
import Link from "next/link";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { UnionToIntersection } from "react-hook-form/dist/types/path/common";
import { MdComputer } from "react-icons/md";

type DevelopmentFormDefaultValues = Partial<
  UnionToIntersection<DistributiveOmit<DevelopmentFormData, "type">>
>;

type Props = {
  // formのtypeと、それ以外のプロパティを一括で渡せるようにする。
  // 指定されたtypeに必要のないプロパティも渡せるように、Union型をIntersection型に変換する処理を書いた
  /**
   * 非制御コンポーネントから制御コンポーネントに変わったというエラーを出さないためにstring型のフィールドには
   * 文字列を入れる。
   */
  defaultValues?: DevelopmentFormDefaultValues;
  ideaId: string;
  onSubmit: (data: DevelopmentFormData) => void;
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
  const { developmentStatuses } = useDevStatusesQuery();
  const { data: repositories } = trpc.me.getMyGitHubRepositories.useQuery(
    undefined,
    { initialData: [] }
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
    getFieldState,
  } = useForm<DevelopmentFormData>({
    defaultValues: {
      ...defaultValues,
    },
    resolver: zodResolver(developmentFormSchema),
  });

  const utils = trpc.useContext();
  const handleReloadRepositories = () => {
    utils.me.getMyGitHubRepositories.refetch();
  };

  return (
    <AppForm
      onSubmit={handleSubmit(onSubmit)}
      onCancel={onCancel}
      submitIcon={MdComputer}
      submitText={submitText}
      isSubmitting={isLoading}
    >
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
        name="developmentStatusId"
        render={({ field }) => {
          return (
            <Select
              label="開発状況"
              data={developmentStatuses.map((s) => ({
                value: s.id.toString(),
                label: s.name,
              }))}
              error={getFieldState("developmentStatusId").error?.message}
              {...field}
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
              label="開発したモノのURL"
              error={getFieldState("developedItemUrl").error?.message}
              {...field}
            />
          );
        }}
      />
    </AppForm>
  );
};
