import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  const { email, code } = await request.json(); // Assuming the email is also sent in the request body

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if the code matches and hasn't expired
    const now = new Date();
    if (
      user.verificationCode === code &&
      user.verificationCodeExpires !== null &&
      user.verificationCodeExpires > now
    ) {
      // Update the user as verified
      await prisma.user.update({
        where: { email },
        data: {
          isEmailVerified: true,
          verificationCode: null,
          verificationCodeExpires: null,
        },
      });

      return new Response(
        JSON.stringify({ message: "Email verified successfully." }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ message: "Invalid or expired verification code." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Verification error:", error);
    return new Response(JSON.stringify({ message: "Internal server error." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
