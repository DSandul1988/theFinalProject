import getCurrentUser from "@/app/actions/getCurrentUser";
import getReservations from "@/app/actions/getReservations";
import getListingById from "@/app/actions/getListingsById";

import { SafeReservation } from "@/app/types";
import EmptyState from "@/app/Components/EmptyState";
import getReservationById from "@/app/actions/getReservationById";
import PaymentClient from "../[listingId]/PaymentClient";
interface IParams {
  listingId: string;
  reservationId: string;
}

const PaymentPage = async ({ params }: { params: IParams }) => {
  const { listingId, reservationId } = params;
  console.log({ listingId, reservationId });
  const correctListingId = Array.isArray(listingId) ? listingId[1] : listingId;
  const reservationIdc = Array.isArray(listingId) ? listingId[0] : listingId;
  const currentUser = await getCurrentUser();

  const listing = await getListingById({ listingId: correctListingId });

  if (!currentUser) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  }

  if (!listing) {
    return (
      <EmptyState
        title="Listing Not Found"
        subtitle="The requested listing could not be found."
      />
    );
  }

  const reservation = await getReservationById(
    reservationIdc,
    correctListingId
  );

  if (!reservation) {
    return (
      <EmptyState
        title="No Reservations Found"
        subtitle="Looks like you have no reservations to pay for."
      />
    );
  }

  // Transform reservation to include listing as SafeListing
  const safeReservation: SafeReservation = {
    ...reservation,
    createdAt: reservation.createdAt.toISOString(),
    startDate: reservation.startDate.toISOString(),
    endDate: reservation.endDate.toISOString(),
    listing: {
      ...listing,
      createdAt: listing.createdAt.toString(),
    },
  };

  return (
    <PaymentClient
      reservations={safeReservation}
      user={currentUser}
      listing={listing}
    />
  );
};

export default PaymentPage;
