import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { RouterInputs } from "../../../server/lib/trpc";
import { AppRouter } from "../../../server/router";
import { GitHubErrors } from "../../../share/errors";
import { Routes } from "../../../share/routes";
import { CreateRepositoryData, DevelopFormData } from "../../../share/schema";
import { trpc } from "../../lib/trpc";
import {
  isTRPCClientError,
  showErrorNotification,
  showSuccessNotification,
} from "../../lib/utils";
import { useSessionQuery } from "../session/useSessionQuery";
import { ideaQueryKey } from "./useIdeaQuery";

export const developedQueryKey = (
  ideaId: string,
  loggedInUserId: string | undefined
) =>
  [...ideaQueryKey(ideaId), "user", loggedInUserId ?? "", "developed"] as const;

export const useDevelop = (ideaId: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { session } = useSessionQuery();

  const { data: developedData, ...others } = useQuery({
    queryKey: developedQueryKey(ideaId, session?.user.id),
    queryFn: () => {
      return trpc.idea.isDevelopedByLoggedInUser.query({ ideaId });
    },
  });

  const developMutation = useMutation({
    mutationFn: (data: RouterInputs["idea"]["develop"]) => {
      return trpc.idea.develop.mutate(data);
    },
    onSuccess: async (_, fields) => {
      await queryClient.invalidateQueries(
        developedQueryKey(ideaId, session?.user.id)
      );

      const message =
        fields.type === "createRepository"
          ? `リポジトリ" ${fields.githubRepositoryName} "を作成し、お題の開発を開始しました。`
          : "お題の開発を開始しました。";

      showSuccessNotification({
        title: "お題の開発",
        message,
      });
    },
    onError: (error, fieldValues) => {
      if (fieldValues.type === "createRepository" && isTRPCClientError(error)) {
        handleCreateRepositoryError(error, fieldValues);
        return;
      }

      showErrorNotification({
        title: "お題の開発",
        message: "お題の開発を開始できませんでした。",
      });
    },
  });

  // お題の開発情報を更新する
  const updateDevelopmentMutation = useMutation({
    mutationFn: (data: RouterInputs["development"]["update"]) => {
      return trpc.development.update.mutate(data);
    },
    onSuccess: (_, fields) => {
      const message =
        fields.type === "createRepository"
          ? `リポジトリ" ${fields.githubRepositoryName} "を作成し、開発情報を更新しました。`
          : "開発情報を更新しました。";

      showSuccessNotification({
        title: "お題開発情報の更新",
        message,
      });

      queryClient.invalidateQueries(["developments", fields.developmentId]);
      router.push(Routes.development(fields.ideaId, fields.developmentId));
    },
    onError: (error, fields) => {
      if (fields.type === "createRepository" && isTRPCClientError(error)) {
        handleCreateRepositoryError(error, fields);
        return;
      }

      showErrorNotification({
        title: "お題開発情報の更新",
        message: "お題開発情報を更新できませんでした。",
      });
    },
  });

  // お題の開発をキャンセルする
  const cancelDevelopMutation = useMutation({
    mutationFn: ({ developmentId }: { developmentId: string }) => {
      return trpc.development.delete.mutate({ developmentId: developmentId });
    },
    onSuccess: async () => {
      // 特定のテーマのキャッシュを無効にする
      await queryClient.invalidateQueries(ideaQueryKey(ideaId));
    },
  });

  // リポジトリの作成段階で発生したエラーをハンドリングする
  const handleCreateRepositoryError = (
    error: TRPCClientError<AppRouter>,
    fields: Extract<DevelopFormData, { type: "createRepository" }>
  ) => {
    // 認証エラーで失敗した場合、自動ログインのあとに入力情報をURLパラメータに保存して
    // 画面を更新する
    if (error.data?.code === "UNAUTHORIZED") {
      showErrorNotification({
        title: "リポジトリの作成",
        message: "リポジトリの作成に失敗したため、再ログインを行います。",
      });

      const url = new URL(window.location.href);
      const createRepositoryData: CreateRepositoryData = {
        repositoryName: fields.githubRepositoryName ?? "",
        repositoryDesc: fields.githubRepositoryDescription ?? "",
        developmentComment: fields.comment ?? "",
      };
      Object.keys(createRepositoryData).forEach((k) => {
        const key = k as keyof CreateRepositoryData;
        url.searchParams.set(key, createRepositoryData[key] ?? "");
      });

      signIn("github", { callbackUrl: url.toString() });
      return;
    }

    // 名前がすでに存在する場合は、その旨を表示させる
    if (
      error.data?.code === "BAD_REQUEST" &&
      error.message === GitHubErrors.NAME_ALREADY_EXISTS
    ) {
      showErrorNotification({
        title: "リポジトリの作成",
        message: `リポジトリを作成できませんでした。\nリポジトリ " ${fields.githubRepositoryName} " はすでに存在します。`,
      });
      return;
    }
  };

  return {
    data: { developedData, ...others },
    mutations: {
      developMutation,
      updateDevelopmentMutation,
      cancelDevelopMutation,
    },
  };
};
