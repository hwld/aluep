import { zodResolver } from "@hookform/resolvers/zod";
import { Radio, Text, Textarea, TextInput } from "@mantine/core";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { MdComputer } from "react-icons/md";
import {
  ThemeDevelopFormData,
  themeDevelopFormSchema,
} from "../../../share/schema";
import { OmitStrict } from "../../../types/OmitStrict";
import { AppForm } from "../../ui/AppForm";

type Props = {
  defaultValues?: OmitStrict<ThemeDevelopFormData, "themeId">;
  themeId: string;
  onSubmit: (data: ThemeDevelopFormData) => void;
  onCancel: () => void;
  submitText: string;
  isLoading?: boolean;
  /** リポジトリが作成できなかったため、自動で再ログインを行っていたか */
  isRelogined?: boolean;
};

export const ThemeDevelopForm: React.FC<Props> = ({
  defaultValues,
  themeId,
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
  } = useForm<ThemeDevelopFormData>({
    defaultValues: {
      ...defaultValues,
      themeId,
    },
    resolver: zodResolver(themeDevelopFormSchema),
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
                value={
                  "createRepository" satisfies ThemeDevelopFormData["type"]
                }
              />
              <Radio
                label="既存のリポジトリを使用する"
                value={
                  "referenceRepository" satisfies ThemeDevelopFormData["type"]
                }
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
