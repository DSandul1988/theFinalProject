"use client";

import { SafeListing, SafeReservation } from "@/app/types";
import { Listing, Reservation } from "@prisma/client";
import EmptyState from "../../Components/EmptyState";

interface ReservationDetailsProps {
  reservation: SafeReservation | null;
  listing?: SafeListing;
}

const ReservationDetails: React.FC<ReservationDetailsProps> = ({
  reservation,
  listing,
}) => {
  console.log(`The listing is "${listing?.id}`);
  console.log(`The reservation is "${reservation}`);
  if (!reservation)
    return (
      <div>
        <EmptyState />
      </div>
    );

  return (
    <div className="flex flex-col h-1/2 justify-center  w-full p-4 border border-gray-300 rounded-lg shadow-sm">
      <img
        src={listing?.imgSrc}
        alt="Listing"
        className="w-24 h-24 object-cover rounded-lg"
      />
      <h2 className="text-xl font-semibold mb-4">
        Total Price: ${reservation.totalPrice}
      </h2>
      <h2 className="text-xl font-semibold mb-4">
        From : {reservation.startDate.substring(0, 10)} to{" "}
        {reservation.endDate.substring(0, 10)}
      </h2>

      {/* Display more details as needed */}
    </div>
  );
};

export default ReservationDetails;
