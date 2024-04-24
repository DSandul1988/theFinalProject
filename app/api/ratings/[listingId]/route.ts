import prisma from "@/app/libs/prismadb"; // Ensure the path is correct for your setup
import { NextResponse } from "next/server"; // Import NextResponse for handling responses

interface IParams {
  listingId?: string;
}

// The GET function for fetching ratings
export async function GET(request: Request, { params }: { params: IParams }) {
  const { listingId } = params;

  // Validate the listingId
  if (!listingId || typeof listingId !== "string") {
    return new Response(JSON.stringify({ error: "Invalid listing ID" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    // Fetch the listing by its ID and include its related ratings
    const ratings = await prisma.rating.findMany({
      where: {
        listingId: listingId,
      },
    });

    // Check if ratings are found
    if (!ratings || ratings.length === 0) {
      return new Response(
        JSON.stringify({ message: "No ratings found for this listing." }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Optionally calculate the average rating
    const averageRating =
      ratings.reduce((acc, curr) => acc + curr.value, 0) / ratings.length;

    // Return the ratings and the average
    return new Response(JSON.stringify({ averageRating }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch ratings" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
