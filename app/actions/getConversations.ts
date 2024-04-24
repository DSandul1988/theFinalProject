// Import the Prisma client instance from a specified path, providing access to database operations
import prisma from "@/app/libs/prismadb";
// Import the getCurrentUser function, which retrieves the current session's user details
import getCurrentUser from "./getCurrentUser";

// Define an asynchronous function getConversations without parameters to fetch user conversations
const getConversations = async () => {
  // Retrieve the current user; await pauses execution until the promise is resolved
  const currentUser = await getCurrentUser();

  // If no currentUser is found or if the currentUser object lacks an id, return an empty array
  if (!currentUser?.id) {
    return [];
  }

  try {
    // Fetch conversations from the database where the current user is a participant
    const conversations = await prisma.conversation.findMany({
      // Order conversations by the timestamp of the last message, descending
      orderBy: {
        lastMessageAt: "desc",
      },
      // Filter conversations to include only those where the currentUser's id is a participant
      where: {
        userIds: {
          has: currentUser.id,
        },
      },
      // Include related users and messages in the result, with messages including their sender
      include: {
        users: true, // Include user details of participants in each conversation
        messages: {
          include: {
            sender: true, // Include details of the sender for each message
          },
        },
      },
    });

    // Return the fetched conversations array
    return conversations;
  } catch (error: any) {
    // Catch and handle any errors encountered during the try block
    // Return an empty array in case of error, indicating no conversations could be retrieved
    return [];
  }
};

// Export the getConversations function to make it available for import in other parts of the application
export default getConversations;
