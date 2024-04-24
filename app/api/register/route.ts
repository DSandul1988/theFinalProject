import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import nodemailer from "nodemailer";
import generateVerificationCode from "@/auth-utils";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sanduld724@gmail.com",
    pass: "ciem nyrk vmir nwvz",
  },
});
export async function POST(request: Request) {
  const body = await request.json();

  console.log("Received data:", body);
  const { email, name, password } = body;
  const hashedPassword = await bcrypt.hash(password, 12);
  const verificationCode = generateVerificationCode();
  console.log("Received data:", body);
  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
      verificationCode,
      verificationCodeExpires: new Date(Date.now() + 3600000),
    },
  });

  await transporter.sendMail({
    from: '"Global Stay" <sanduld724@gmail.com>', // Adjust as necessary
    to: email,
    subject: "Verify Your Email",
    html: `<h1>Email Verification</h1>
           <p>Thank you for registering. Please use the following code to verify your email address:</p>
           <p><b>${verificationCode}</b></p>
           <p>This code is valid for 1 hour.</p>`,
  });
  return NextResponse.json(user);
}
