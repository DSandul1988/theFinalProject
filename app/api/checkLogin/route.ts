import prisma from "@/app/libs/prismadb";
import { randomBytes } from "crypto";
import bcrypt from "bcrypt";
import generateVerificationCode from "@/auth-utils";
import nodemailer from "nodemailer";
// import { generateTempAuthToken } from "@/auth-utils";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sanduld724@gmail.com",
      pass: "ciem nyrk vmir nwvz",
    },
  });
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.hashedPassword) {
      return new Response(JSON.stringify({ message: "User not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const isCorrectPass = await bcrypt.compare(password, user.hashedPassword);
    console.log("Password verification result:", isCorrectPass);

    if (!isCorrectPass) {
      return new Response(JSON.stringify({ message: "User not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (user && user.email) {
      if (user.isEmailVerified && !user.partialLogin) {
        const verificationCode = generateVerificationCode();
        console.log("Sending verification code to:", user.email);
        await transporter.sendMail({
          from: '"|Global Stay" <sanduld724@gmail.com>',
          to: email,
          subject: "Your Login Verification Code",
          html: `<p>Your login verification code is: ${verificationCode}</p>`,
        });

        await prisma.user.update({
          where: { email: user.email },
          data: {
            lverificationCode: verificationCode,
            lverificationCodeExpires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
          },
        });
      }
      return new Response(
        JSON.stringify({
          success: true,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response(JSON.stringify({ message: "Something went wrong" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Verification error:", error);
    return new Response(JSON.stringify({ message: "Internal server error." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
