import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
  console.log("Starting POST request processing...");

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    console.log("No current user found. Unauthorized request.");
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { content, listingId } = body; // Removed userId from body, using currentUser.id instead

  if (!content || !listingId) {
    console.log("Missing required fields in request body:", {
      content,
      listingId,
    });
    return new Response("Missing review content or listing ID", {
      status: 400,
    });
  }

  console.log("Looking for existing Review...", {
    userId: currentUser.id,
    listingId,
  });

  const newReview = await prisma.review.create({
    data: {
      content: content,
      userId: currentUser.id, // Use the authenticated user's ID
      listingId: listingId,
    },
  });
  console.log("New review created:", newReview);
  return new Response(JSON.stringify(newReview), {
    status: 201, // HTTP 201 Created
    headers: { "Content-Type": "application/json" },
  });
}
