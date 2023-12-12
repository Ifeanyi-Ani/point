import PostPoint from "@/components/forms/PostPoint";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

async function Page() {
  const user = await currentUser();

  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  console.log(userInfo);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1>Create Points</h1>
      <PostPoint userId={userInfo._id} />
    </>
  );
}
export default Page;
