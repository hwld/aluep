import { ArrowIcon } from "@/client/pageComponents/AboutPage/ArrowIcon";
import { FunctionCard } from "@/client/pageComponents/AboutPage/FunctionCard";
import { FunctionIcon } from "@/client/pageComponents/AboutPage/FunctionIcon";
import { SectionTitle } from "@/client/pageComponents/AboutPage/SectionTitle";
import { UsecaseSection } from "@/client/pageComponents/AboutPage/UsecaseSection";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { Box, Center, Image, Stack, Text } from "@mantine/core";
import {
  TbArrowBigLeftLine,
  TbArrowBigRightLine,
  TbBulb,
  TbCode,
  TbFileText,
  TbInfoCircle,
  TbSearch,
  TbUserCode,
  TbUserEdit,
} from "react-icons/tb";
import classes from "./AboutPage.module.css";

type Props = {};

export const AboutPage: React.FC<Props> = () => {
  return (
    <Box className={classes.root}>
      <PageHeader icon={TbInfoCircle} pageName="Aluepについて" />

      <Center className={classes["hero-card"]}>
        <Stack align="center" className={classes["hero-container"]}>
          <Image
            src="/app-logo.svg"
            alt="app-logo"
            className={classes["app-logo"]}
          />
          <Stack className={classes["hero-card-text-wrapper"]}>
            <Text className={classes["hero-card-title"]}>
              作りたい
              <Text span className={classes["hero-card-title-strong"]}>
                アプリ
              </Text>
              が見つかる
            </Text>
            <Text className={classes["hero-card-text"]}>
              Aluepは、アプリ開発のお題を見つけることのできるWebアプリです。
              <br />
              興味を持ったお題を見つけて、開発を始めましょう。
            </Text>
          </Stack>
        </Stack>
      </Center>

      <Stack className={classes.content}>
        <Stack className={classes["section"]}>
          <SectionTitle
            number={1}
            title="Aluepの使いかた"
            subTitle="Start Guide"
          />

          <UsecaseSection
            usecase={{ icon: TbUserCode, name: "お題の開発者" }}
            flow={
              <>
                <FunctionIcon icon={TbSearch} />
                <ArrowIcon icon={TbArrowBigRightLine} />
                <FunctionIcon icon={TbCode} />
                <Stack gap={0}>
                  <ArrowIcon icon={TbArrowBigRightLine} />
                  <ArrowIcon icon={TbArrowBigLeftLine} />
                </Stack>
                <FunctionIcon icon={TbBulb} />
              </>
            }
            functions={
              <>
                <FunctionCard
                  icon={TbSearch}
                  title="お題を探そう!"
                  description="ホーム画面には人気のお題やオススメのお題があります。検索画面で条件を詳しく入力することもできます。気になったお題を見つけてみましょう！"
                />
                <FunctionCard
                  icon={TbCode}
                  title="開発を始めよう！"
                  description="気になったお題が見つかったら、開発に使用するリポジトリを登録して、開発を始めてみましょう！開発中には、学んだことをメモすることもできます。"
                />
                <FunctionCard
                  icon={TbBulb}
                  title="みんなの開発を参考にしよう！"
                  description="開発に行き詰まったときには、ほかの開発者のコードを参考にしてみましょう！参考になった開発者には、いいねを送ることもできます。"
                />
              </>
            }
          />

          <UsecaseSection
            usecase={{ icon: TbUserEdit, name: "お題の投稿者" }}
            flow={
              <>
                <FunctionIcon icon={TbFileText} />
                <Stack gap={0}>
                  <ArrowIcon icon={TbArrowBigRightLine} />
                  <ArrowIcon icon={TbArrowBigRightLine} />
                </Stack>
                <FunctionIcon icon={TbBulb} />
              </>
            }
            functions={
              <>
                <FunctionCard
                  icon={TbFileText}
                  title="お題を投稿しよう！"
                  description="アイデアを思いついて、みんなの実装を見てみたいときや、自分が作っているアプリの実装に詰まったときには、お題を投稿することで解決するかもしれません。"
                />
                <FunctionCard
                  icon={TbBulb}
                  title="みんなの開発を参考にしよう！"
                  description="投稿したら、お題のURLを共有することで開発者を募集することができます。お題にはコメントを残せるので、お題の実装に関する疑問を書くと、誰かが回答してくれるかもしれません。"
                />
              </>
            }
          />
        </Stack>
      </Stack>
    </Box>
  );
};
