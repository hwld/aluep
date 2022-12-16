import { Button, Card, Flex, Text, useMantineTheme } from "@mantine/core";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { BsDot, BsQuestionLg, BsSearch } from "react-icons/bs";
import { MdPostAdd } from "react-icons/md";

type Props = { page: string; user?: Session["user"] };

export const NothingThemeCard: React.FC<Props> = ({ page, user }) => {
  const router = useRouter();
  const mantineTheme = useMantineTheme();
  const handleCreateTheme = () => {
    router.push("/themes/create");
  };
  const nothingHome = () => {
    return (
      <Flex direction={"column"} gap={10}>
        <Text>お題はまだ投稿されていません。</Text>
        {user ? (
          <Button
            bg={"red.7"}
            leftIcon={<MdPostAdd size={25} />}
            onClick={handleCreateTheme}
          >
            お題を投稿する
          </Button>
        ) : (
          <></>
        )}
      </Flex>
    );
  };

  const nothigSearch = () => {
    return (
      <Flex direction={"column"} gap={30}>
        <Flex justify={"center"} align={"end"}>
          <BsSearch size={70} color={mantineTheme.colors.red[7]} />
          <BsDot size={40} color={mantineTheme.colors.red[3]} />
          <BsDot size={40} color={mantineTheme.colors.red[4]} />
          <BsDot size={40} color={mantineTheme.colors.red[5]} />
          <BsDot size={40} color={mantineTheme.colors.red[6]} />
          <BsQuestionLg size={70} color={mantineTheme.colors.red[7]} />
        </Flex>
        <Text size="xl">
          条件に一致する検索結果はありません。<br></br>
          <Text align="center"> 別の条件をお試しください。</Text>
        </Text>
      </Flex>
    );
  };

  const changePage = () => {
    if (page === "Home") {
      return nothingHome();
    } else if (page === "Search") {
      return nothigSearch();
    }
  };

  return (
    <Card h="100%" w="100%">
      <Flex
        justify={"center"}
        sx={() => {
          return { margin: 40 };
        }}
      >
        {changePage()}
      </Flex>
    </Card>
  );
};
