import { ServerError } from "@/client/pageComponents/ServerError/ServerError";
import { PageLayout } from "@/client/ui/PageLayout";

export default ServerError;

ServerError.getLayout = (page, { isSideBarOpen }) => {
  return <PageLayout isSideBarOpen={isSideBarOpen}>{page}</PageLayout>;
};
