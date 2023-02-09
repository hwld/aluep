import { Button } from "@mantine/core";
import { NextPage } from "next";
import { trpc } from "../client/trpc";

const ReportTest: NextPage = () => {
  const handleClick = async () => {
    await trpc.report.theme.mutate({
      reportDetail: "うおおおおおお",
      targetThemeUrl: "http://localhost:3000/report-test",
    });
  };
  return <Button onClick={handleClick}>送信</Button>;
};

export default ReportTest;
