import PaymentDetails from "@/app/(payment)/payment/PaymentDetails";
import ReservationDetails from "@/app/(payment)/payment/ReservationDetails";
import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import { Listing, Reservation, User } from "@prisma/client";

interface PaymentClientProps {
  reservations: SafeReservation;
  user: SafeUser;
  listing: SafeListing;
}

const PaymentClient: React.FC<PaymentClientProps> = ({
  reservations,
  user,
  listing,
}) => {
  return (
    <div className="flex flex-row w-full  gap-20 ">
      <div className="w-2/6">
        <ReservationDetails reservation={reservations} listing={listing} />
      </div>
      <div className="w-4/12">
        <PaymentDetails
          reservation={reservations}
          user={user}
          listing={listing}
        />
      </div>
    </div>
  );
};

export default PaymentClient;
