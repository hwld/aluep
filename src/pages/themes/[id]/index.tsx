import Link from "next/link";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { prisma } from "../../../server/prismadb";

export const getServerSideProps = async ({
  req,
  res,
  query,
}: GetServerSidePropsContext) => {
  const { id: themeId } = query;
  if (typeof themeId !== "string") {
    return { notFound: true };
  }

  // 表示するテーマ
  const rawTheme = await prisma.appTheme.findUnique({
    where: { id: themeId },
    include: { tags: true, user: true },
  });
  if (!rawTheme) {
    return { notFound: true };
  }
  const theme = {
    id: rawTheme.id,
    title: rawTheme.title,
    tags: rawTheme.tags.map(({ id, name }) => ({ id, name })),
    description: rawTheme.description,
    createdAt: rawTheme.createdAt.toUTCString(),
    updatedAt: rawTheme.updatedAt.toUTCString(),
    user: {
      id: rawTheme.user.id,
      name: rawTheme.user.name,
      image: rawTheme.user.image,
    },
  };

  // 表示するテーマの参加者
  const rawDevelopers = await prisma.appThemeDeveloper.findMany({
    where: { appThemeId: themeId },
    include: { user: true },
  });
  const developers = rawDevelopers.map(
    ({ user, githubUrl, comment, createdAt }) => ({
      userid: user.id,
      name: user.name,
      image: user.image,
      githubUrl,
      comment,
      createdAt: createdAt.toUTCString(),
    })
  );

  return { props: { theme, developers } };
};

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export const ThemeDetail: NextPage<PageProps> = ({ theme, developers }) => {
  return (
    <Box p={30}>
      <Title>{theme.title}</Title>
      <Avatar src={theme.user.image} size="xl" radius={100} />
      <Text>{theme.user.name}</Text>
      <Flex gap={10}>
        {theme.tags.map((tag) => {
          return (
            <Badge key={tag.id} sx={{ textTransform: "none" }}>
              {tag.name}
            </Badge>
          );
        })}
      </Flex>
      <Text sx={{ whiteSpace: "pre-wrap" }}>{theme.description}</Text>
      <Button component={Link} href={`/themes/${theme.id}/join`}>
        参加する
      </Button>
      <Title mt={30}>開発者</Title>
      <Stack mt={10}>
        {developers.map((developer) => {
          return (
            <Card shadow="sm" withBorder>
              <Avatar src={developer.image} />
              <Text>{developer.name}</Text>
              <Text>{developer.comment}</Text>
              <Text>{new Date(developer.createdAt).toLocaleString()}</Text>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
};
export default ThemeDetail;
