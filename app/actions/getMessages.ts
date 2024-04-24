import prisma from "@/app/libs/prismadb";
// Fetch messages associated with the conversation from the database
const getMessages = async (conversationId: string) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },
      include: {
        sender: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return messages;
  } catch (error: any) {
    // Return an empty array if an error occurs during fetching
    return [];
  }
};

export default getMessages;
