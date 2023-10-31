import { ArrowIcon } from "@/client/pageComponents/AboutPage/ArrowIcon";
import { FunctionCard } from "@/client/pageComponents/AboutPage/FunctionCard";
import { FunctionIcon } from "@/client/pageComponents/AboutPage/FunctionIcon";
import { SectionTitle } from "@/client/pageComponents/AboutPage/SectionTitle";
import { UsecaseSection } from "@/client/pageComponents/AboutPage/UsecaseSection";
import {
  SvgArrowBigLeftLine,
  SvgArrowBigRightLine,
  SvgBulb,
  SvgCode,
  SvgFileText,
  SvgInfoCircle,
  SvgSearch,
  SvgUserCode,
  SvgUserEdit,
} from "@/client/ui/Icons";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { Routes } from "@/share/routes";
import { Box, Center, Image, Stack, Text } from "@mantine/core";
import clsx from "clsx";
import Link from "next/link";
import classes from "./AboutPage.module.css";

type Props = {};

const blackHeight = 720;

export const AboutPage: React.FC<Props> = () => {
  return (
    <Box className={classes.root}>
      <Box className={classes.container}>
        <PageHeader icon={SvgInfoCircle} pageName="Aluepについて" />

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
          <Stack className={classes.section}>
            <SectionTitle
              number={1}
              title="Aluepとは？"
              subTitle="What is Aluep?"
            />

            <Text className={classes.text}>
              プログラミングを学んでいると、「作りたいものがある人のほうがプログラミングが上達しやすい」という言葉をどこかで耳にしたことがあると思います。
              作りたいものがたくさんあって、常に手を動かし続けている人の上達速度が早いのは確かだと思います。
              しかし、重要なのは作りたいものがあることではなく、実際に様々なものを作り込んだという経験です。
              <br />
              <br />
              Aluepは、作りたいものが思い浮かばないという方が、そういった言葉を耳にして諦めてしまわないように、作りたいと思えるアプリのアイデアが集まるWebサービスを目指しています。
              <br />
              <br />
              しかし、お題を投稿するという形のWebサービスであるため、皆さまのご協力が必要です。
              ご自身がこれまでに作ってきたアプリ、作ると勉強になりそうなアプリをお題として投稿してもらいたいのです。
              <br />
              ぜひご協力をお願いします。
            </Text>
          </Stack>

          <Stack
            className={clsx(classes["section"], classes["usecase-section"])}
          >
            <SectionTitle
              number={2}
              title="Aluepの使い方"
              subTitle="How to use Aluep"
            />

            <UsecaseSection
              usecase={{ icon: SvgUserCode, name: "お題の開発者" }}
              flow={
                <>
                  <FunctionIcon icon={SvgSearch} />
                  <ArrowIcon icon={SvgArrowBigRightLine} />
                  <FunctionIcon icon={SvgCode} />
                  <Stack gap={0}>
                    <ArrowIcon icon={SvgArrowBigRightLine} />
                    <ArrowIcon icon={SvgArrowBigLeftLine} />
                  </Stack>
                  <FunctionIcon icon={SvgBulb} />
                </>
              }
              functions={
                <>
                  <FunctionCard
                    icon={SvgSearch}
                    title="お題を探そう!"
                    description="ホーム画面には人気のお題やオススメのお題があります。検索画面で条件を詳しく入力することもできます。気になったお題を見つけてみましょう！"
                  />
                  <FunctionCard
                    icon={SvgCode}
                    title="開発を始めよう！"
                    description="気になったお題が見つかったら、開発に使用するリポジトリを登録して、開発を始めてみましょう！開発中には、学んだことをメモすることもできます。"
                  />
                  <FunctionCard
                    icon={SvgBulb}
                    title="みんなの開発を参考にしよう！"
                    description="開発に行き詰まったときには、ほかの開発者のコードを参考にしてみましょう！参考になった開発者には、いいねを送ることもできます。"
                  />
                </>
              }
            />

            <UsecaseSection
              usecase={{ icon: SvgUserEdit, name: "お題の投稿者" }}
              flow={
                <>
                  <FunctionIcon icon={SvgFileText} />
                  <Stack gap={0}>
                    <ArrowIcon icon={SvgArrowBigRightLine} />
                    <ArrowIcon icon={SvgArrowBigRightLine} />
                  </Stack>
                  <FunctionIcon icon={SvgBulb} />
                </>
              }
              functions={
                <>
                  <FunctionCard
                    icon={SvgFileText}
                    title="お題を投稿しよう！"
                    description="アイデアを思いついて、みんなの実装を見てみたいときや、自分が作っているアプリの実装に詰まったときには、お題を投稿することで解決するかもしれません。"
                  />
                  <FunctionCard
                    icon={SvgBulb}
                    title="みんなの開発を参考にしよう！"
                    description="投稿したら、お題のURLを共有することで開発者を募集することができます。お題にはコメントを残せるので、お題の実装に関する疑問を書くと、誰かが回答してくれるかもしれません。"
                  />
                </>
              }
            />
          </Stack>

          <Stack className={classes.section}>
            <SectionTitle number={3} title="開発メンバー" subTitle="Member" />
            <Text className={classes.text}>僕です</Text>
          </Stack>
        </Stack>

        <Box h="300px" />
        <Box
          style={{
            position: "fixed",
            backgroundImage: "url(/black-wave.svg)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "top",
            height: "450px",
            bottom: blackHeight,
            left: -400,
            right: -10,
            zIndex: -100,
          }}
        />
        <Box
          style={{
            position: "fixed",
            backgroundColor: "var(--mantine-color-gray-8)",
            height: `calc(${blackHeight}px + 30px)`,
            left: -400,
            // container-type: inline-sizeを指定すると、空白ができてしまう
            bottom: -30,
            right: -10,
            zIndex: -100,
          }}
        />

        <Stack className={clsx(classes.section, classes.content, classes.dark)}>
          <SectionTitle
            number={4}
            title="動機 / 開発方針"
            subTitle="Motivation / Policy"
          />
          <Text className={classes.text}>
            Aluepは、僕がそこそこの規模のWebアプリケーションを開発してみたいという動機から作り始めたものです。
            僕はこれまで小さなものはいくつか作ってきましたが、多機能で複雑なWebアプリは作ったことがありませんでした。
            <br />
            <br />
            そこで、Aluepはできるだけ多くの機能を実装し、複雑なWebアプリを目指しています。
            機能を実装する目的は、ユーザーのことを考えてというより、どういう機能を作ってみたいか、どういう機能の実装を経験したいかを重視しています。
            そのため、操作が複雑になったり、必要な機能が存在しない事があると思います。
            <br />
            <br />
            しかし、こういった機能がほしい、こういった機能はやめてほしいといった要望はどんどんお待ちしています。
            想像のユーザーのための機能に対しては消極的ですが、実際のユーザーの声には応えていきたいです。
            <br />
            要望のある方は、ぜひ
            <Text
              component={Link}
              href={Routes.contact()}
              target="_blank"
              span
              className={clsx(classes.text, classes.link)}
            >
              お問い合わせフォーム
            </Text>
            からお願いします。
          </Text>
        </Stack>

        <Box h={100} />
      </Box>
    </Box>
  );
};
