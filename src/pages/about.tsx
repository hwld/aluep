import { About } from "@/client/pageComponents/About/About";
import { withReactQueryGetServerSideProps } from "@/server/lib/GetServerSidePropsWithReactQuery";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async () => {}
);

export default About;
