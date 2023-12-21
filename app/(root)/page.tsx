import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import PointCard from "@/components/cards/PointCard";
import { fetchPoints } from "@/lib/actions/point.actions";
import { fetchUser } from "@/lib/actions/user.actions";

async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchPoints(
    searchParams.page ? +searchParams.page : 1,
    30,
  );
  return (
    <div>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">hello</section>
    </div>
  );
}
export default Home;
