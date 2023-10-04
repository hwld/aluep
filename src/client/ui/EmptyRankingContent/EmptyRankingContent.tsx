import { Flex, Text, useMantineTheme } from "@mantine/core";
import { ReactElement } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlinePostAdd } from "react-icons/md";
import { TbHeart } from "react-icons/tb";

type Props = { page: "developments" | "posters" };

export const EmptyRankingContent: React.FC<Props> = ({ page }) => {
  const mantineTheme = useMantineTheme();

  const pageData: {
    [T in Props["page"]]: { target: string; icon: ReactElement };
  } = {
    posters: {
      target: "投稿者",
      icon: (
        <>
          <AiOutlineUser size={60} />
          <TbHeart size={80} color={mantineTheme.colors.red[7]} />
        </>
      ),
    },
    developments: {
      target: "開発者",
      icon: (
        <>
          <MdOutlinePostAdd size={60} />
          <TbHeart size={80} color={mantineTheme.colors.red[7]} />
        </>
      ),
    },
  };

  return (
    <Flex direction="column" align="center">
      <Flex align="flex-end">{pageData[page].icon}</Flex>
      <Text mt="sm" size="lg" ta="center" c="gray.5" fw="bold">
        いいねがありません
      </Text>
      <Text c="gray.4" ta="center">
        {`${pageData[page].target}へのいいねのランキングがここに表示されます。`}
      </Text>
    </Flex>
  );
};
