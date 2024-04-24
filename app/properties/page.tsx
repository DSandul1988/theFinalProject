import EmptyState from "../Components/EmptyState";
import getCurrentUser from "../actions/getCurrentUser";
import getListings from "../actions/getListings";
import getReservations from "../actions/getReservations";
import PropertiesClient from "./PropertiesClient";
import TripsClient from "./PropertiesClient";

const PropertiesPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <EmptyState title="Please log in " />;
  }

  const listings = await getListings({
    userId: currentUser.id,
  });

  if (listings.length === 0) {
    return <EmptyState title=" There are no properties" />;
  }

  return <PropertiesClient listings={listings} currentUser={currentUser} />;
};
export default PropertiesPage;
