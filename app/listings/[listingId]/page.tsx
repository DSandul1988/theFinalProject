import EmptyState from "@/app/Components/EmptyState";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingsById";
import ListingClient from "./ListingClient";
import getReservations from "@/app/actions/getReservations";
import getRatings from "@/app/actions/getRatings";
import getReviews from "@/app/actions/getReviews";

interface IParams {
  listingId?: string;
}
const ListingPage = async ({ params }: { params: IParams }) => {
  const { listingId } = params;
  const listing = await getListingById(params);
  const reservations = await getReservations(params);
  const currentUser = await getCurrentUser();
  const ratings = await getRatings(listingId);
  const reviews = await getReviews(listingId);
  console.log(ratings);
  if (!listing) {
    return <EmptyState />;
  }
  return (
    <div>
      <ListingClient
        content={reviews}
        listing={listing}
        currentUser={currentUser}
        reservations={reservations}
        ratings={ratings}
      />
    </div>
  );
};

export default ListingPage;
