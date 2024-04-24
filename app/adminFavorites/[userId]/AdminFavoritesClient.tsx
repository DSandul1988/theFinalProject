"use client";

import { useRouter } from "next/navigation";
import Container from "../../Components/Container";
import Heading from "../../Components/Heading";
import { SafeListing, SafeUser } from "../../types";

import ListingCard from "../../Components/ListingCard";

interface AdminFavoritesClienProps {
  listings: SafeListing[];
  currentUser?: SafeUser | null;
}

const AdminFavoritesClient: React.FC<AdminFavoritesClienProps> = ({
  listings,
  currentUser,
}) => {
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
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            data={listing}
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
};

export default AdminFavoritesClient;
