// Import the Prisma client library for interacting with the database.
import prisma from "../libs/prismadb";

// Import the utility function for retrieving the current user's details.
import getCurrentUser from "./getCurrentUser";

// Define the TypeScript interface for the function parameters, allowing an optional email filter.
export interface IAdminUsersParams {
  email?: string;
}

// Define an asynchronous function to retrieve admin users, optionally filtered by email.
export default async function getAdminUsers(params: IAdminUsersParams) {
  // Retrieve the current user's details to ensure a user is logged in.
  const currentUser = await getCurrentUser();

  // If there is no current user, return an empty array indicating no users are retrieved.
  if (!currentUser) {
    return [];
  }

  try {
    // Attempt to retrieve users from the database, ordered by creation date in descending order,
    // excluding the current user, and optionally filtering by email if provided.
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        NOT: {
          email: currentUser.email, // Exclude the current user from the results.
        },
        ...(params.email && {
          // Conditional spread operator to apply email filter if provided.
          email: params.email,
        }),
      },
    });
    // Return the list of users retrieved from the database.
    return users;
  } catch (error: any) {
    // Catch and handle any errors during the database query.
    console.error(error); // Log the error to the console.
    return []; // Return an empty array indicating no users are retrieved due to an error.
  }
}
