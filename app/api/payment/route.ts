import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();

  const {
    cardholderName,
    cardNumber,
    expiryDate,
    reservationId,
    userId,
    amount,
  } = body;
  const payment = await prisma.payment.create({
    data: {
      cardholderName,
      cardNumber,
      expiryDate,
      reservationId,
      userId,
      amount,
    },
  });

  return NextResponse.json(payment);
}
