import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { userId } = body;

    // Check for valid currentUser and target userId
    if (!currentUser?.id || !userId) {
      return new NextResponse("Unauthorized or invalid request", {
        status: 400,
      });
    }

    // Check for existing conversation between currentUser and target userId
    const existingConversation = await prisma.conversation.findMany({
      where: {
        OR: [
          { userIds: { equals: [currentUser.id, userId] } },
          { userIds: { equals: [userId, currentUser.id] } },
        ],
      },
    });

    if (existingConversation.length > 0) {
      return NextResponse.json(existingConversation[0]); // Return the first found conversation
    }

    // If no existing conversation, create a new one
    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [{ id: currentUser.id }, { id: userId }],
        },
      },
      include: {
        users: true,
      },
    });

    // Notify users of the new conversation
    newConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, "conversation:new", newConversation);
      }
    });

    return NextResponse.json(newConversation);
  } catch (error) {
    console.error(error); // It's a good practice to log the error
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
