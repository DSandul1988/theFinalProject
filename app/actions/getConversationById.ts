// Import the Prisma client instance from a path relative to the application structure
import prisma from "@/app/libs/prismadb";
// Import the getCurrentUser function, responsible for fetching the current user's details
import getCurrentUser from "./getCurrentUser";

// Define an asynchronous function getConversationById that takes a conversationId string as its parameter
const getConversationById = async (conversationId: string) => {
  try {
    // Await the result of getCurrentUser() to fetch the currently authenticated user's details
    const currentUser = await getCurrentUser();

    // Check if the currentUser object is null or if the currentUser's email is not present, then return null
    if (!currentUser?.email) {
      return null;
    }

    // Await the Prisma client's conversation model to find a unique record where the ID matches conversationId
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId, // Condition to match the conversation by its ID
      },
      include: {
        users: true, // Include the users associated with the conversation in the result
      },
    });

    // Return the conversation object if found
    return conversation;
  } catch (error: any) {
    // Catch any errors during the try block execution
    // Log the error and a custom message to the console
    console.log(error, "SERVER_ERROR");
    // Return null in case of an error, indicating failure to retrieve the conversation
    return null;
  }
};

// Export the getConversationById function to be used elsewhere in the application
export default getConversationById;
