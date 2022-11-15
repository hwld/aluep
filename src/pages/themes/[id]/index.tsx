import { Avatar, Badge, Box, Flex, Text, Title } from "@mantine/core";
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { prisma } from "../../../server/prismadb";

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  const { id: themeId } = query;
  if (typeof themeId !== "string") {
    return { notFound: true };
  }

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
    tags: rawTheme.tags,
    description: rawTheme.description,
    createdAt: rawTheme.createdAt.toUTCString(),
    updatedAt: rawTheme.updatedAt.toUTCString(),
    user: {
      id: rawTheme.user.id,
      name: rawTheme.user.name,
      image: rawTheme.user.image,
    },
  };

  return { props: { theme } };
};

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export const ThemeDetail: NextPage<PageProps> = ({ theme }) => {
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
      <Text>{theme.description}</Text>
    </Box>
  );
};
export default ThemeDetail;
