import prisma from "@/app/libs/prismadb"; // Ensure the path matches your project structure
import { NextResponse } from "next/server"; // Import NextResponse for handling responses
interface IParams {
  listingId?: string;
}
// The GET function for fetching reviews
export async function GET(request: Request, { params }: { params: IParams }) {
  const { listingId } = params;

  // Validate the listingId
  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid listing ID");
  }

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
      return NextResponse.json({
        message: "No reviews found for this listing.",
      });
    }

    // Map over the reviews to include user name in the response
    const reviewsWithUserName = reviews.map((review) => ({
      id: review.id,
      content: review.content,
      userName: review.user.name, // Access the user's name from the included user relation
      createdAt: review.createdAt,
    }));

    return NextResponse.json(reviewsWithUserName);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.error();
  }
}
