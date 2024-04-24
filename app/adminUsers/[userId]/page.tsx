import EmptyState from "@/app/Components/EmptyState";

import UserClient from "./UserClient";
import getUserById from "@/app/actions/getUserById";
interface IParams {
  userId?: string;
}
const UserPage = async ({ params }: { params: IParams }) => {
  const user = await getUserById(params);

  if (!user) {
    return <EmptyState />;
  }
  return (
    <div>
      <UserClient user={user} />
    </div>
  );
};

export default UserPage;
