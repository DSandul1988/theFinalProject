"use client";

import { useRouter } from "next/navigation";
import Container from "../Components/Container";
import Heading from "../Components/Heading";
import { SafeListing, SafeReservation, SafeUser } from "../types";
import { Key, useCallback, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { error } from "console";
import ListingCard from "../Components/ListingCard";

interface TripsClienProps {
  reservations: SafeReservation[];
  currentUser?: SafeUser | null;
}

const TripsClient: React.FC<TripsClienProps> = ({
  reservations,
  currentUser,
}) => {
  const router = useRouter();
  const [deletingId, setDelitingId] = useState("");
  const onCancel = useCallback(
    (id: string) => {
      setDelitingId(id);
      axios
        .delete(`/api/reservations/${id}`)
        .then(() => {
          toast.success("Reservation canceled");
          router.refresh();
        })
        .catch((error) => {
          toast.error(error?.response?.data?.error);
          console.log(error);
        })
        .finally(() => {
          setDelitingId("");
        });
    },
    [router]
  );
  const onPay = useCallback(
    (reservationId: any, listingId: any) => {
      router.push(`/payment/${listingId}/${reservationId}`);
    },
    [router]
  );
  return (
    <Container>
      <Heading title="Where are you going" />
      <div
        className="mt-10 grid grid-cols-1 sm:grid-cols-2 
      md:grid-cols-3
      lg:grid-cols-4
      xl:grid-cols-5
      2xl:grid-cols-6
      gap-8"
      >
        {reservations.map((reservation) => (
          <ListingCard
            key={reservation.id}
            data={reservation.listing}
            reservation={reservation}
            actionId={reservation.id}
            onAction={
              reservation.isPaid
                ? () => onCancel(reservation.id)
                : () => onPay(reservation.listing.id, reservation.id)
            }
            disabled={deletingId === reservation.id}
            actionLabel={
              reservation.isPaid ? "Cancel reservation" : "Pay reservation"
            }
            currentUser={currentUser}
            isPaid={reservation.isPaid}
          />
        ))}
      </div>
    </Container>
  );
};

export default TripsClient;
