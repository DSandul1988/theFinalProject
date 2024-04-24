import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return new Response(JSON.stringify({ error: "User not authenticated" }), {
      status: 401,
    });
  }

  const body = await request.json();
  const { reservationId, isPaid } = body;

  // Validate input
  if (!reservationId || typeof isPaid !== "boolean") {
    return new Response(JSON.stringify({ error: "Invalid request data" }), {
      status: 400,
    });
  }

  try {
    // Assuming 'isPaid' is intended to be updated to true based on the context
    const updatedReservation = await prisma.reservation.update({
      where: {
        id: reservationId, // Ensure this matches the schema's ID field
      },
      data: {
        isPaid: isPaid, // or simply isPaid, if it's always true
      },
    });

    return new Response(JSON.stringify(updatedReservation), {
      status: 200,
    });
  } catch (error) {
    // Handle cases where the reservation does not exist or other database errors
    return (
      new Response("Something went wrong"),
      {
        status: 500,
      }
    );
  }
}
