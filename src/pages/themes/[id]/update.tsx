import {
  Box,
  Button,
  MultiSelect,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { dehydrate, QueryClient, useMutation } from "@tanstack/react-query";
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { unstable_getServerSession } from "next-auth/next";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  allTagsQueryKey,
  useAllTagsQuery,
} from "../../../client/hooks/useAllTagsQuery";
import { sessionQuerykey } from "../../../client/hooks/useSessionQuery";
import {
  themeQueryKey,
  useThemeQuery,
} from "../../../client/hooks/useThemeQuery";
import { trpc } from "../../../client/trpc";
import { GetServerSidePropsWithReactQuery } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { prisma } from "../../../server/prismadb";
import { appRouter } from "../../../server/routers/_app";
import { RouterInputs } from "../../../server/trpc";
import { authOptions } from "../../api/auth/[...nextauth]";

export const getServerSideProps: GetServerSidePropsWithReactQuery = async ({
  req,
  res,
  query,
}) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const { id: themeId } = query;
  if (typeof themeId !== "string") {
    return { notFound: true };
  }

  const caller = appRouter.createCaller({ session });
  const theme = await caller.themes.get({ themeId });
  const allTags = await caller.themes.getAllTags();

  //　お題の作成者とログインユーザーが異なれば404にする
  if (theme.user.id !== session.user.id) {
    return { notFound: true };
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(themeQueryKey(themeId), () => theme);
  await queryClient.prefetchQuery(allTagsQueryKey, () => allTags);
  const dehydratedState = dehydrate(queryClient);

  return {
    props: {
      dehydratedState,
    },
  };
};

const UpdateTheme: NextPage = () => {
  const router = useRouter();
  // TODO
  const themeId = router.query.id as string;
  const { theme } = useThemeQuery(themeId);
  const { allTags } = useAllTagsQuery();

  const [title, setTitle] = useState(theme?.title ?? "");
  const [description, setDescription] = useState(theme?.description ?? "");
  const [tags, setTags] = useState(theme?.tags.map(({ id }) => id) ?? []);

  const updateMutation = useMutation({
    mutationFn: (data: RouterInputs["themes"]["update"]) => {
      return trpc.themes.update.mutate(data);
    },
    onSuccess: () => {
      showNotification({
        color: "green",
        title: "お題の更新",
        message: "お題を更新しました。",
      });
    },
    onError: () => {
      showNotification({
        color: "red",
        title: "お題の更新",
        message: "お題を更新できませんでした。",
      });
    },
  });

  const handleUpdateTheme = () => {
    if (!theme) {
      return;
    }
    updateMutation.mutate({ themeId: theme.id, title, description, tags });
  };

  return (
    <Box p={30}>
      <Text fw={700} size={32} component="h1">
        お題の投稿
      </Text>
      <TextInput
        label="タイトル"
        value={title}
        onChange={({ target: { value } }) => setTitle(value)}
      />
      {/* TODO: タグの実装をどうする？ */}
      <MultiSelect
        data={allTags.map((tag) => ({ value: tag.id, label: tag.name }))}
        onChange={(values) => {
          setTags(values);
        }}
        value={tags}
        label="タグ"
        searchable
        nothingFound="タグが見つかりませんでした"
      />
      <Textarea
        label="説明"
        autosize
        minRows={10}
        mt={10}
        value={description}
        onChange={({ target: { value } }) => setDescription(value)}
      />
      <Button mt={10} onClick={handleUpdateTheme}>
        更新
      </Button>
    </Box>
  );
};

export default UpdateTheme;
