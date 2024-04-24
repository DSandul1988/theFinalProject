import EmptyState from "@/app/Components/EmptyState";
import getListings from "@/app/actions/getListings";
import getUserById from "@/app/actions/getUserById";
import AdminFavoritesClient from "./AdminFavoritesClient";
import getFavoriteListings from "@/app/actions/getFavoriteListings";
import getFavoriteListingsByUserId from "@/app/actions/getFavoriteListingsById";
import getFavoriteListingsById from "@/app/actions/getFavoriteListingsById";

interface IParams {
  userId?: string;
}

const AdminPropertiesPage = async ({ params }: { params: IParams }) => {
  const fetchedUser = await getUserById(params);
  console.log(params);

  let fetchedListings: string | any[] = [];
  if (fetchedUser?.id) {
    fetchedListings = await getFavoriteListingsById(fetchedUser.id);
  } else {
    console.log("Hello");
  }

  if (fetchedListings.length === 0) {
    return <EmptyState title="There are no properties" />;
  }

  return (
    <AdminFavoritesClient
      listings={fetchedListings}
      currentUser={fetchedUser}
    />
  );
};

export default AdminPropertiesPage;
