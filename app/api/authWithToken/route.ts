import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  const { email, token } = await request.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (
    !user ||
    user.oneTimeLoginToken !== token ||
    new Date() > new Date(user.oneTimeLoginTokenExpires || 0)
  ) {
    return new Response(
      JSON.stringify({ message: "Invalid or expired token." }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Token is valid; proceed with session creation or user login logic
  // This process might vary depending on how sessions are handled in your application
  // For example, with NextAuth.js, you might use JWTs, set cookies directly, or invoke signIn method

  // Invalidate the token after use by setting it to null
  await prisma.user.update({
    where: { email },
    data: {
      oneTimeLoginToken: null,
      oneTimeLoginTokenExpires: null,
      partialLogin: true,
    },
  });

  // Respond with success message
  return new Response(
    JSON.stringify({
      success: true,
      message: "User authenticated with token.",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
