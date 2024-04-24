import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
  console.log("Starting POST request processing...");

  const currentUser = await getCurrentUser();
  console.log("Current user:", currentUser);

  if (!currentUser) {
    console.log("No current user found. Unauthorized request.");
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  console.log("Request body:", body);

  const { value, listingId, userId } = body;

  if (!value || !listingId || !userId) {
    console.log("Missing required fields in request body:", {
      value,
      listingId,
      userId,
    });
    return new Response("Missing rating value or listing ID", { status: 400 });
  }

  // Attempt to find an existing rating for the user and listing
  console.log("Looking for existing rating...", { userId, listingId });
  const existingRating = await prisma.rating.findFirst({
    where: {
      userId: userId,
      listingId: listingId,
    },
  });

  console.log("Existing rating:", existingRating);

  // If a rating exists, update it
  if (existingRating) {
    console.log("Updating existing rating...");
    const updatedRating = await prisma.rating.update({
      where: { id: existingRating.id },
      data: { value: value },
    });
    console.log("Updated rating:", updatedRating);
    return new Response(JSON.stringify(updatedRating), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    // If no existing rating, create a new one
    console.log("Creating new rating...");
    const newRating = await prisma.rating.create({
      data: {
        value: value,
        userId: userId, // This ensures the rating is linked to the user
        listingId: listingId, // This ensures the rating is linked to the listing
      },
    });
    console.log("New rating created:", newRating);
    return new Response(JSON.stringify(newRating), {
      status: 201, // HTTP 201 Created
      headers: { "Content-Type": "application/json" },
    });
  }
}
