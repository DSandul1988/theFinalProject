import EmptyState from "@/app/Components/EmptyState";
import getListings from "@/app/actions/getListings";
import getUserById from "@/app/actions/getUserById";
import AdminPropertiesClient from "./AdminPropertiesClient";

interface IParams {
  userId?: string;
}

const AdminPropertiesPage = async ({ params }: { params: IParams }) => {
  const fetchedUser = await getUserById(params);
  console.log(params);
  const fetchedListings = await getListings({ userId: fetchedUser?.id });

  if (fetchedListings.length === 0) {
    return <EmptyState title="There are no properties" />;
  }

  return (
    <AdminPropertiesClient
      listings={fetchedListings}
      currentUser={fetchedUser}
    />
  );
};

export default AdminPropertiesPage;
