import EmptyState from "@/app/Components/EmptyState";
import getListings from "@/app/actions/getListings";
import getUserById from "@/app/actions/getUserById";

import AdminReservationsClient from "./AdminReservationsClient";
import getReservations from "@/app/actions/getReservations";

interface IParams {
  userId?: string;
}

const AdminPropertiesPage = async ({ params }: { params: IParams }) => {
  const fetchedUser = await getUserById(params);
  console.log(params);
  const fetchedListings = await getReservations({ userId: fetchedUser?.id });

  if (fetchedListings.length === 0) {
    return <EmptyState title="There are no properties" />;
  }

  return (
    <AdminReservationsClient
      reservations={fetchedListings}
      currentUser={fetchedUser}
    />
  );
};

export default AdminPropertiesPage;
