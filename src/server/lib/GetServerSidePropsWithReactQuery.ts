import { DehydratedState } from "@tanstack/react-query";
import { GetServerSideProps } from "next";

export type GetServerSidePropsWithReactQuery = GetServerSideProps<{
  dehydratedState: DehydratedState;
}>;

//TODO
//sessionをdehydrateしたgetServerSidePropsのテンプレートみたいなのを作る
