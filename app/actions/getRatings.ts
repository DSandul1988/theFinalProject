import prisma from "@/app/libs/prismadb";

const getRatings = async (listingId?: string) => {
  try {
    // Fetch the listing by its ID and include its related ratings
    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      include: {
        ratings: true, // Include the related ratings in the response
      },
    });

    // Ensure the listing and its ratings array are defined
    if (!listing || !listing.ratings || listing.ratings.length === 0) {
      console.log("No ratings found for this listing:", listingId);
      console.log(listing?.ratings);
      return 0; // Return 0 if no ratings are found to avoid NaN in the calculation
    }

    // Calculate the average rating from the included ratings
    const averageRating =
      listing.ratings.reduce((acc, curr) => acc + curr.value, 0) /
      listing.ratings.length;
    console.log(listing?.ratings.length);
    console.log(`Average rating for listingId ${listingId}:`, averageRating);

    // Return the average rating as a number
    return averageRating;
  } catch (error) {
    console.error("Error fetching average rating for listing:", error);
    return 0; // Return 0 as the average rating in case of error
  }
};

export default getRatings;
