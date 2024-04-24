import prisma from "@/app/libs/prismadb";

export default async function getFavoriteListingsByUserId(userId: string) {
  try {
    // Define an asynchronous function to fetch favorite listings by a specific user ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    // Check if user or user's favoriteIds are not available or empty
    if (!user || !user.favoriteIds || user.favoriteIds.length === 0) {
      return [];
    }

    // Fetch favorite listings based on user's favoriteIds
    const favorites = await prisma.listing.findMany({
      where: {
        id: {
          in: user.favoriteIds,
        },
      },
    });
    // Ensure the safety of fetched listings by converting createdAt dates to ISO string format
    const safeFavorites = favorites.map((favorite) => ({
      ...favorite,
      createdAt: favorite.createdAt.toISOString(), // Ensure date is in ISO string format
    }));

    return safeFavorites;
  } catch (error: any) {
    console.error("Failed to fetch favorite listings:", error.message);
    throw new Error(
      error.message || "An error occurred while fetching favorite listings."
    );
  }
}
