// Import the getServerSession function from next-auth to handle session management
import { getServerSession } from "next-auth";
// Import the authentication configuration options from the NextAuth API route
import { authOptions } from "@/pages/api/auth/[...nextauth]";
// Import the Prisma client instance for database operations
import prisma from "@/app/libs/prismadb";

// Define an asynchronous function getSession to retrieve the current server session using NextAuth
export async function getSession() {
  // Await and return the server session by passing authentication options to getServerSession
  return await getServerSession(authOptions);
}

// Define the default exported asynchronous function getCurrentUser to fetch the currently authenticated user
export default async function getCurrentUser() {
  try {
    // Await and store the session object retrieved from getSession()
    const session = await getSession();
    // If the session object is null, or if the session's user object lacks an email, return null
    if (!session?.user?.email) {
      return null;
    }
    // Await and store the user fetched from the database where the email matches the session user's email
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string, // Cast email to string type to match Prisma's expected type
      },
    });
    // If no user is found in the database, return null
    if (!currentUser) {
      return null;
    }
    // Return the currentUser object with date fields converted to ISO string format and handle nullable emailVerified
    return {
      ...currentUser, // Spread operator to copy properties from the currentUser object
      createdAt: currentUser.createdAt.toISOString(), // Convert createdAt to ISO string format
      updatedAt: currentUser.updatedAt.toISOString(), // Convert updatedAt to ISO string format
      emailVerified: currentUser.emailVerified?.toISOString() || null, // Convert emailVerified to ISO string format if not null
    };
  } catch (error: any) {
    // Catch any errors that occur during the try block execution
    // Return null in the case of an error, indicating failure to retrieve the current user
    return null;
  }
}
