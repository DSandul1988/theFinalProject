import prisma from "@/app/libs/prismadb";
import { randomBytes } from "crypto";
// import { generateTempAuthToken } from "@/auth-utils";

export async function POST(request: Request) {
  const { email, code } = await request.json();
  const token = randomBytes(32).toString("hex");
  const expiration = new Date(Date.now() + 10 * 60 * 1000);

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const now = new Date();
    console.log("Now:", now);
    console.log("Code Expires:", user.lverificationCodeExpires);
    console.log("Stored Code:", user.lverificationCode, "Provided Code:", code);
    if (
      user.lverificationCode === code &&
      user.lverificationCodeExpires &&
      user.lverificationCodeExpires > now
    ) {
      await prisma.user.update({
        where: { email },
        data: {
          isEmailVerified: true,
          lverificationCode: null,
          lverificationCodeExpires: null,
          oneTimeLoginToken: token,
          oneTimeLoginTokenExpires: expiration,
        },
      });

      return new Response(
        JSON.stringify({
          success: true,
          token: token, // Include the generated token in the response
        }),
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
