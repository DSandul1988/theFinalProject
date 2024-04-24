import { catego } from "./../Components/NavigationBar/Categories";
import prisma from "@/app/libs/prismadb";

export interface IListingParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  startDate?: string;
  endDate?: string;
  location?: string;
  category?: string;
  emailValue?: string;
}

export default async function getListings(params: IListingParams) {
  console.log("getListings called with params:", params);
  try {
    const {
      userId,
      guestCount,
      roomCount,
      startDate,
      endDate,
      location,
      category,
      emailValue,
    } = params;
    let query: any = {};

    // Construct query based on provided parameters
    if (userId) {
      query.userId = userId;
    }

    if (category) {
      query.category = category;
    }

    if (roomCount) {
      query.roomCount = { gte: +roomCount };
    }
    if (guestCount) {
      query.guestCount = { gte: +guestCount };
    }

    if (location) {
      query.location = location;
    }
    console.log("Constructed query before date filtering:", query);
    // Apply date filtering if both startDate and endDate are provided
    if (startDate && endDate) {
      query.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: startDate },
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate },
              },
            ],
          },
        },
      };
    }
    // Fetch listings from the database based on the constructed query
    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log(`Found ${listings.length} listings matching the query.`);
    const safeListing = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));
    return safeListing;
  } catch (error: any) {
    throw new Error(error);
  }
}
