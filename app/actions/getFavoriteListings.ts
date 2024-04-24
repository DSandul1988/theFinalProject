// Import the Prisma client instance to interact with the database
import prisma from "@/app/libs/prismadb";
// Import the getCurrentUser function to fetch the current user's data
import getCurrentUser from "./getCurrentUser";

// Define the default exported asynchronous function getFavoriteListings to fetch favorite listings of the current user
export default async function getFavoriteListings() {
  try {
    // Await the current user's data by calling getCurrentUser and check for its existence
    const currentUser = await getCurrentUser();

    // If no current user is found, return an empty array indicating no favorite listings
    if (!currentUser) {
      return [];
    }

    // Await the retrieval of listings from the database where listing IDs are within the currentUser's favoriteIds
    const favorites = await prisma.listing.findMany({
      where: {
        id: {
          in: [...(currentUser.favoriteIds || [])], // Spread the favoriteIds into an array or default to an empty array
        },
      },
    });

    // Map over the favorites array to convert createdAt dates to string format for each listing object
    const safeFavorites = favorites.map((favorite) => ({
      ...favorite, // Spread operator to copy properties from the favorite object
      createdAt: favorite.createdAt.toString(), // Convert createdAt to string format
    }));

    // Return the modified favorites array with stringified createdAt dates
    return safeFavorites;
  } catch (error: any) {
    // Catch any errors during the try block execution
    // Throw a new error with the caught error message
    throw new Error(error);
  }
}
