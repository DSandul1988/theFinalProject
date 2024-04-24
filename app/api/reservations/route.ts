import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

import nodemailer from "nodemailer";

// Configure Nodemailer (example with Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sanduld724@gmail.com",
    pass: "ciem nyrk vmir nwvz",
  },
});

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.error();
  }
  const body = await request.json();

  const { listingId, startDate, endDate, totalPrice } = body;

  if (!listingId || !startDate || !endDate || !totalPrice) {
    return NextResponse.error();
  }

  const listingAndReservation = await prisma.listing.update({
    where: {
      id: listingId,
    },
    data: {
      reservations: {
        create: {
          userId: currentUser.id,
          startDate,
          endDate,
          totalPrice,
        },
      },
    },
  });
  if (currentUser.email) {
    await transporter.sendMail({
      from: '"GlobalStay" <sanduld724@gmail.com>',
      to: currentUser.email, // Now guaranteed not to be null
      subject: "Reservation Confirmation",
      html: `<h1>Hello ${currentUser.name}</h1><p>Your reservation from ${startDate} to ${endDate} has been confirmed and waiting payment.</p>`,
    });
  } else {
    // Handle the case where currentUser.email is null
    console.error("User email is null, cannot send reservation confirmation.");
  }
  return NextResponse.json(listingAndReservation);
}
