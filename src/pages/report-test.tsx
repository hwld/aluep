import { Button } from "@mantine/core";
import { NextPage } from "next";
import { trpc } from "../client/trpc";

const ReportTest: NextPage = () => {
  const handleClick = async () => {
    await trpc.report.theme.mutate({
      reportDetail: "うおおおおおお",
      targetTheme: {
        url: "http://localhost:3000/report-test",
        title: "テスト",
      },
    });
  };
  return <Button onClick={handleClick}>送信</Button>;
};

export default ReportTest;
