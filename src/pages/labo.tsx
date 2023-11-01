import { pickUpIdeas, findSearchedIdeas } from "@/server/finders/idea";
import { __new_db__ } from "@/server/lib/db";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  const pick = await findSearchedIdeas({
    loggedInUserId: undefined,
    pagingData: { limit: 3, page: 2 },
    searchArgs: {
      keyword: "f",
      period: "monthly",
      tagIds: ["f4fdtum9zgyqpy11bilfwx04"],
      order: "createdAsc",
    },
  });
  console.log(pick);
  return { props: {} };
};
export default function Page() {
  return <>div</>;
}
