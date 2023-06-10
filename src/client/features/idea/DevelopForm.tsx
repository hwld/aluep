import { DistributiveOmit } from "@emotion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Radio, Select, Text, Textarea, TextInput } from "@mantine/core";
import { UnionToIntersection } from "@tiptap/react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { MdComputer } from "react-icons/md";
import { DevelopmentStatus } from "../../../server/models/developmentStatus";
import { DevelopFormData, developFormSchema } from "../../../share/schema";
import { AppForm } from "../../ui/AppForm";

type Props = {
  developmentStatuses: DevelopmentStatus[];
  // formのtypeと、それ以外のプロパティを一括で渡せるようにする。
  // 指定されたtypeに必要のないプロパティも渡せるように、Union型をIntersection型に変換する処理を書いた
  defaultValues?: Partial<
    UnionToIntersection<
      DistributiveOmit<DevelopFormData, "type" | "ideaId">
    > & {
      type: DevelopFormData["type"];
    }
  >;
  ideaId: string;
  onSubmit: (data: DevelopFormData) => void;
  onCancel: () => void;
  submitText: string;
  isLoading?: boolean;
  /** リポジトリが作成できなかったため、自動で再ログインを行っていたか */
  isRelogined?: boolean;
};

export const DevelopForm: React.FC<Props> = ({
  developmentStatuses,
  defaultValues,
  ideaId,
  isRelogined = false,
  onSubmit,
  onCancel,
  submitText,
  isLoading,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    getFieldState,
  } = useForm<DevelopFormData>({
    defaultValues: {
      ...defaultValues,
      ideaId,
    },
    resolver: zodResolver(developFormSchema),
  });

  return (
    <AppForm
      onSubmit={handleSubmit(onSubmit)}
      onCancel={onCancel}
      submitIcon={MdComputer}
      submitText={submitText}
      isSubmitting={isLoading}
    >
      {isRelogined && (
        <Text mt={5} size="sm" color="red">
          GitHubリポジトリを作成することができなかったため、再ログインを行いました。
          <br />
          もう一度「{submitText}」ボタンを押してください。
        </Text>
      )}
      <Controller
        control={control}
        name="type"
        render={({ field }) => {
          return (
            <Radio.Group
              spacing="xs"
              orientation="vertical"
              label="開発に使用するGitHubリポジトリを選択する"
              withAsterisk
              {...field}
            >
              <Radio
                label="新しいリポジトリを作成する"
                value={"createRepository" satisfies DevelopFormData["type"]}
              />
              <Radio
                label="既存のリポジトリを使用する"
                value={"referenceRepository" satisfies DevelopFormData["type"]}
              />
            </Radio.Group>
          );
        }}
      />

      {watch("type") === "createRepository" && (
        <>
          <Controller
            control={control}
            name="githubRepositoryName"
            render={({ field }) => {
              return (
                <TextInput
                  withAsterisk
                  label="リポジトリ名"
                  error={getFieldState("githubRepositoryName").error?.message}
                  {...field}
                  // Formのデータとしてunionを使用しているため、typeによってここがundefinedになる可能性がある。
                  // そうすると、非制御コンポーネントから制御コンポーネントに変わったというエラーが出てしまうため、空文字を手動で設定する。
                  // defaultValueで設定できそうだが、unionを使用しているため、どれか一つしか設定することができない。
                  value={field.value ?? ""}
                />
              );
            }}
          />
          <Controller
            control={control}
            name="githubRepositoryDescription"
            render={({ field }) => {
              return (
                <Textarea
                  label="リポジトリの説明"
                  minRows={3}
                  error={
                    getFieldState("githubRepositoryDescription").error?.message
                  }
                  {...field}
                  value={field.value ?? ""}
                />
              );
            }}
          />
        </>
      )}

      {watch("type") === "referenceRepository" && (
        <>
          <Controller
            control={control}
            name="githubRepositoryUrl"
            render={({ field }) => {
              return (
                <TextInput
                  required
                  label="開発に使用するGitHubリポジトリ"
                  error={getFieldState("githubRepositoryUrl").error?.message}
                  {...field}
                  value={field.value ?? ""}
                />
              );
            }}
          />
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
                  value={field.value ?? ""}
                />
              );
            }}
          />
        </>
      )}
      <Controller
        control={control}
        name="comment"
        render={({ field }) => {
          return (
            <Textarea
              label="コメント"
              minRows={5}
              error={errors.comment?.message}
              {...field}
            />
          );
        }}
      />
    </AppForm>
  );
};
