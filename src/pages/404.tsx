import { NotFound } from "@/client/pageComponents/NotFound/NotFound";
import { PageLayout } from "@/client/ui/PageLayout";

export default NotFound;

NotFound.getLayout = (page, { isSideBarOpen }) => {
  return <PageLayout isSideBarOpen={isSideBarOpen}>{page}</PageLayout>;
};
