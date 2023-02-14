import { Box, Radio, Stack, Text } from "@mantine/core";
import React, { useState } from "react";
import { RepositoryFormData, ThemeJoinFormData } from "../../share/schema";
import { OmitStrict } from "../../types/OmitStrict";
import { ThemeJoinAlreadyForm } from "./ThemeJoinAlreadyForm";
import { ThemeJoinNewForm } from "./ThemeJoinNewForm";

type Props = {
  defaultValues?: OmitStrict<ThemeJoinFormData, "themeId">;
  themeId: string;
  onSubmit: (data: ThemeJoinFormData) => void;
  onCancel: () => void;
  submitText: string;
  isLoading?: boolean;
  repoFormData?: RepositoryFormData;
  repository: string;
};
export const ThemeJoinForm: React.FC<Props> = ({
  defaultValues,
  themeId,
  repository,
  onSubmit,
  onCancel,
  submitText,
  repoFormData,
}) => {
  //repository=already:リダイレクトしていない
  //repository=new:リダイレクトしている
  //repository=edit:お題を更新する
  //radioでradioボタンの初期表示を指定
  let radio: string;
  if (repository === "already" || repository === "edit") {
    radio = "already";
  } else {
    radio = "new";
  }
  const [val, setVal] = useState(radio);
  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    setVal(e.currentTarget.value);
  };

  return (
    <Stack>
      <Radio.Group
        value={val}
        spacing="xs"
        name="repository"
        orientation="vertical"
        label="開発に使用するGitHubリポジトリを選択する"
        withAsterisk
        styles={(theme) => ({ label: { color: theme.colors.gray[5] } })}
      >
        {repository !== "new" && (
          <Radio
            value="already"
            label="既存のリポジトリを使用する"
            onClick={handleClick}
            styles={(theme) => ({
              label: { color: theme.colors.gray[7] },
            })}
          />
        )}

        {repository === "new" && (
          <Text mt={5} size="sm" color="red">
            GitHubリポジトリを作成することができなかったため、再ログインを行いました。
            <br />
            もう一度「{submitText}」ボタンを押してください。
          </Text>
        )}

        <Radio
          value="new"
          label="新しいリポジトリを作成する"
          onClick={handleClick}
          styles={(theme) => ({
            label: { color: theme.colors.gray[7] },
          })}
        />
      </Radio.Group>
      {val === "already" && (
        <Box>
          <ThemeJoinAlreadyForm
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            onCancel={onCancel}
            themeId={themeId}
            submitText={submitText}
          />
        </Box>
      )}

      {val === "new" && (
        <Box>
          <ThemeJoinNewForm
            onSubmit={onSubmit}
            onCancel={onCancel}
            themeId={themeId}
            submitText={submitText}
            repoFormData={repoFormData}
          />
        </Box>
      )}
    </Stack>
  );
};
