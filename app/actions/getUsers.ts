import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";
import { IListingParams } from "./getListings";

export default async function getUsers(params: IListingParams) {
  try {
    const { emailValue } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    let query: any = {};

    // If emailValue is provided, apply it as a filter; otherwise, fetch all users
    if (emailValue) {
      query.email = emailValue;
    }

    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        ...query,
        // Ensure we always exclude the current user from the results
        NOT: {
          email: currentUser.email,
        },
      },
    });

    return users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}
