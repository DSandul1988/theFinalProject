// Import the Prisma client instance from the specified path within the application
import prisma from "@/app/libs/prismadb";
// Import the getCurrentUser function from its file in the current directory
import getCurrentUser from "./getCurrentUser";

// Define an asynchronous function named getContacts
const getContacts = async () => {
  // Await and store the result of getCurrentUser(), which fetches the currently logged-in user
  const currentUser = await getCurrentUser();

  // Check if currentUser is falsy, or if currentUser does not have contactIds, or if contactIds array is empty
  if (
    !currentUser ||
    !currentUser.contactIds ||
    currentUser.contactIds.length === 0
  ) {
    // Return an empty array if any of the above conditions are true, indicating no contacts or not logged in
    return [];
  }
  try {
    // Attempt to retrieve contacts from the database
    // Assuming contactIds are stored as an array of user IDs in the currentUser object
    const contacts = await prisma.user.findMany({
      // Specify the condition to find users whose ids are in currentUser's contactIds
      where: {
        id: {
          in: currentUser.contactIds,
        },
      },
      // Order the retrieved contacts by their creation date in descending order
      orderBy: {
        createdAt: "desc",
      },
    });
    // Return the retrieved contacts
    return contacts;
  } catch (error) {
    // Log an error message to the console if the try block fails
    console.error("Failed to retrieve contacts:", error);
    // Return an empty array if there was an error fetching contacts
    return [];
  }
};

export default getContacts;
