import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();

  const {
    title,
    description,
    imageSrc,
    category,
    roomCount,
    guestCount,
    price,
    location,
    bathroomCount,
  } = body;
  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      imgSrc: imageSrc,
      category,
      roomCount,
      guestCount,
      bathroomCount,
      location: location.value,
      price: parseInt(price, 10),
      userId: currentUser.id,
    },
  });

  return NextResponse.json(listing);
}
