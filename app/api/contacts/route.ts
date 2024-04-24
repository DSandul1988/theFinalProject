// pages/api/contacts/index.ts
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb"; // Adjust this path to where your initialized Prisma Client is located

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { currentUserId, userIdToAdd } = body;

    console.log(
      `Attempting to add userIdToAdd: ${userIdToAdd} to currentUserId: ${currentUserId}'s contacts`
    );

    // Validate the input
    if (!currentUserId || !userIdToAdd) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Assuming currentUserId is the email or unique identifier used for user lookup
    const updatedUser = await prisma.user.update({
      where: {
        email: currentUserId,
      },
      data: {
        contactIds: {
          push: userIdToAdd, // Adds the new contactId to the contactIds array
        },
      },
    });

    console.log("Successfully updated user contacts", updatedUser);

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to update user contacts:", error);
    return new Response(
      JSON.stringify({ message: "Failed to update user contacts" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
