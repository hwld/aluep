import { findManyIdeaComments } from "@/server/finders/ideaComment";
import { __new_db__ } from "@/server/lib/db";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  const comments = await findManyIdeaComments({
    where: (comments, { eq }) => {
      return eq(comments.id, "1");
    },
  });

  console.log(comments);
  return { props: {} };
};
export default function Page() {
  return <>div</>;
}
