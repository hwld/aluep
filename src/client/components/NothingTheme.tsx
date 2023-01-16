import { Button, Flex, Text, useMantineTheme } from "@mantine/core";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { AiFillTag } from "react-icons/ai";
import { BsDot } from "react-icons/bs";
import { FaKey } from "react-icons/fa";
import { GoSearch } from "react-icons/go";
import { MdPostAdd } from "react-icons/md";
import { RiQuestionMark } from "react-icons/ri";

type Props = { page: "Home" | "Search" | "initial"; user?: Session["user"] };

export const NothingTheme: React.FC<Props> = ({ page, user }) => {
  const router = useRouter();
  const mantineTheme = useMantineTheme();
  const handleCreateTheme = () => {
    router.push("/themes/create");
  };
  const nothingHome = () => {
    return (
      <Flex direction={"column"} gap={10}>
        <Text color="gray.5">お題はまだ投稿されていません。</Text>
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

  const initialPage = () => {
    return (
      <Flex direction={"column"} gap={30}>
        <Flex justify={"center"} align={"center"} gap={20}>
          <FaKey size={70} color={mantineTheme.colors.red[7]} />
          <Text size={50} c="red.7">
            or
          </Text>
          <AiFillTag size={70} color={mantineTheme.colors.red[7]} />
        </Flex>
        <Text c="gray.5">
          キーワードまたはタグを入力してお題を検索してみよう！<br></br>
        </Text>
      </Flex>
    );
  };

  const nothigSearch = () => {
    return (
      <Flex direction={"column"} gap={30}>
        <Flex justify={"center"} align={"center"}>
          <GoSearch size={70} color={mantineTheme.colors.red[7]} />
          <BsDot size={40} color={mantineTheme.colors.red[3]} />
          <BsDot size={40} color={mantineTheme.colors.red[4]} />
          <BsDot size={40} color={mantineTheme.colors.red[5]} />
          <BsDot size={40} color={mantineTheme.colors.red[6]} />
          <RiQuestionMark size={80} color={mantineTheme.colors.red[7]} />
        </Flex>
        <Text c="gray.5">
          条件に一致する検索結果はありません。<br></br>
          <Text align="center" c="gray.5">
            {" "}
            別の条件をお試しください。
          </Text>
        </Text>
      </Flex>
    );
  };

  const changePage = () => {
    if (page === "Home") {
      return nothingHome();
    } else if (page === "Search") {
      return nothigSearch();
    } else if (page === "initial") {
      return initialPage();
    }
  };

  return (
    <Flex
      justify={"center"}
      sx={() => {
        return { margin: 40 };
      }}
    >
      {changePage()}
    </Flex>
  );
};
