import { Radio, Text } from "@mantine/core";
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
  themeId,
  repository,
  onSubmit,
  onCancel,
  submitText,
  repoFormData,
}) => {
  //repositoryにはリダイレクトしない限りalreadyが必ず渡される。
  //flgでリダイレクトしてあるか判断
  const flg: boolean = repository === "already";
  const [val, setVal] = useState(repository);
  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    setVal(e.currentTarget.value);
  };

  return (
    <Radio.Group
      value={val}
      name="repository"
      orientation="vertical"
      label="開発に使用するGitHubリポジトリを選択する"
      spacing="sm"
      withAsterisk
    >
      {flg ? (
        <Radio
          value="already"
          label="既存のリポジトリを使用する"
          onClick={handleClick}
        />
      ) : (
        <Text mt={5} size="sm" color="red">
          GitHubリポジトリを作成することができなかったため、再ログインを行いました。
          <br />
          もう一度「開発する」ボタンを押してください。
        </Text>
      )}

      <Radio
        value="new"
        label="新しいリポジトリを作成する"
        onClick={handleClick}
      />
      {val === "already" && (
        <ThemeJoinAlreadyForm
          onSubmit={onSubmit}
          onCancel={onCancel}
          themeId={themeId}
          submitText={submitText}
        />
      )}

      {val === "new" && (
        <ThemeJoinNewForm
          onCancel={onCancel}
          themeId={themeId}
          submitText={submitText}
          repoFormData={repoFormData}
        />
      )}
    </Radio.Group>
  );
};
