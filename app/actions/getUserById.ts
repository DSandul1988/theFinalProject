import prisma from "@/app/libs/prismadb";

interface IParams {
  userId?: string;
}

// Adjust the function name and logic to fetch a user by ID
export default async function getUserById(params: IParams) {
  try {
    const { userId } = params;
    // Ensure that the `userId` is provided before proceeding
    if (!userId) {
      throw new Error("A userId must be provided");
    }

    // Query the user model directly using the provided userId
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      // Include any relations if needed, for example, posts, settings, etc.
      // include: {
      //   posts: true, // Assuming the user has related posts you want to fetch
      // },
    });

    // Check if a user was found
    if (!user) {
      return null;
    }

    // Format the response, including converting dates to ISO strings
    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      emailVerified: user.emailVerified?.toISOString() || null,
      // Add any other transformations or included relations here
    };
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while fetching the user"
    );
  }
}
