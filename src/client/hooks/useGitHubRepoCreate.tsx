import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { GitHubErrors } from "../../share/errors";
import { RepositoryFormData } from "../../share/schema";
import { trpc } from "../trpc";
import {
  isTRPCClientError,
  showErrorNotification,
  showSuccessNotification,
} from "../utils";

export const useGitHubRepoCreate = (themeId: string) => {
  const createRepositoryMutation = useMutation({
    mutationFn: (data: RepositoryFormData) => {
      return trpc.github.createRepo.mutate(data);
    },
    onSuccess: () => {
      showSuccessNotification({
        title: "リポジトリの作成",
        message: "リポジトリを作成しました。",
      });
    },
    onError: (error, fieldValues) => {
      if (isTRPCClientError(error)) {
        // 認証エラーで失敗した場合、ログインさせた後にリポジトリ作成ページに飛ばす
        if (error.data?.code === "UNAUTHORIZED") {
          showErrorNotification({
            title: "リポジトリの作成",
            message: "リポジトリの作成に失敗したため、再ログインを行います。",
          });

          const url = new URL(
            `${window.location.origin}/themes/${themeId}/join`
          );
          url.searchParams.set("repoName", fieldValues.repoName);
          url.searchParams.set("repoDescription", fieldValues.repoDescription);
          url.searchParams.set("comment", fieldValues.comment ?? "");
          url.searchParams.set("reRepo", "new");

          signIn("github", { callbackUrl: url.toString() });
          return;
        }

        if (
          error.data?.code === "BAD_REQUEST" &&
          error.message === GitHubErrors.NAME_ALREADY_EXISTS
        ) {
          showErrorNotification({
            title: "リポジトリの作成",
            message: `リポジトリを作成できませんでした。\nリポジトリ " ${fieldValues.repoName} " はすでに存在します。`,
          });
          return;
        }
      }
      showErrorNotification({
        title: "リポジトリの作成",
        message:
          "リポジトリを作成できませんでした。\n再度時間をおいて実行してみてください。",
      });
    },
  });

  return createRepositoryMutation;
};
