import prisma from "@/app/libs/prismadb";

const getReviews = async (listingId?: string) => {
  try {
    // Fetch the listing by its ID and include its related reviews and the users who posted those reviews
    const reviews = await prisma.review.findMany({
      where: {
        listingId: listingId,
      },
      include: {
        user: true, // Include the user related to each review
      },
    });

    // Check if reviews are found
    if (!reviews || reviews.length === 0) {
      console.log("No reviews found for this listing:", listingId);
      return []; // Return an empty array if no reviews are found
    }

    // Map over the reviews to include user name in the response
    const reviewsWithUserName = reviews.map((review) => ({
      id: review.id,
      content: review.content,
      userName: review.user.name, // Access the user's name from the included user relation
      createdAt: review.createdAt,
    }));

    return reviewsWithUserName; // Returns reviews with user names included
  } catch (error) {
    console.error("Error fetching reviews for listing:", error);
    throw new Error("Failed to fetch reviews"); // It's better to throw an error or handle it appropriately
  }
};

export default getReviews;
