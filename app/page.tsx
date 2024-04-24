import { User } from "next-auth";
import Container from "./Components/Container";
import EmptyState from "./Components/EmptyState";
import ListingCard from "./Components/ListingCard";
import UserCard from "./Components/UserCard";
import getAdminUsers from "./actions/getAdminUsers";
import { IAdminUsersParams } from "./actions/getAdminUsers";
import getCurrentUser from "./actions/getCurrentUser";
import getListings, { IListingParams } from "./actions/getListings";
import { SafeListing } from "./types";
import getUsers from "./actions/getUsers";

interface HomeProps {
  searchParams: IListingParams;
}
const Home = async ({ searchParams }: HomeProps) => {
  // console.log("userSearchParams:", userSearchParams);
  console.log("searchParams:", searchParams);
  const currentUser = await getCurrentUser();
  console.log("getListings called with params:", searchParams);
  // console.log("getUsers called with params:", userSearchParams);
  // Check if the current user is a manager
  if (currentUser?.isManager) {
    const users = await getUsers(searchParams);
    if (users.length === 0) {
      return <EmptyState showReset />;
    }
    return (
      <div className="mt-40 pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 m-8 2xl:grid-cols-6">
        {users.map((user: User) => (
          <UserCard data={user} key={user.id} />
        ))}
      </div>
    );
  } else {
    const listings = await getListings(searchParams);
    if (listings.length === 0) {
      return <EmptyState showReset />;
    }
    return (
      <div className="mt-40 pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 m-8 2xl:grid-cols-6">
        {listings.map((listing) => (
          <ListingCard
            currentUser={currentUser}
            key={listing.id}
            data={listing}
          />
        ))}
      </div>
    );
  }
};

export default Home;
