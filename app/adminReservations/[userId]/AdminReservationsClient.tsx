"use client";

import { useRouter } from "next/navigation";
import Container from "../../Components/Container";
import Heading from "../../Components/Heading";
import { SafeListing, SafeReservation, SafeUser } from "../../types";
import { Key, useCallback, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { error } from "console";
import ListingCard from "../../Components/ListingCard";

interface AdminReservationsClienProps {
  reservations: SafeReservation[];
  currentUser?: SafeUser | null;
}

const AdminReservationsClient: React.FC<AdminReservationsClienProps> = ({
  reservations,
  currentUser,
}) => {
  const router = useRouter();
  const [deletingId, setDelitingId] = useState("");
  const onCancel = useCallback(
    (id: string) => {
      setDelitingId(id);
      axios
        .delete(`/api/listings/${id}`)
        .then(() => {
          toast.success("Listing deleted ");
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
  return (
    <Container>
      <Heading title="Properties" />
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
            actionId={reservation.id}
            onAction={onCancel}
            disabled={deletingId === reservation.id}
            actionLabel="Delete property"
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
};

export default AdminReservationsClient;
