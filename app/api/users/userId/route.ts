import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
interface IParams {
  userId: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const { userId } = params;

  if (!userId || typeof userId !== "string") {
    throw new Error("invalid id");
  }

  const user = await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  return NextResponse.json(user);
}
