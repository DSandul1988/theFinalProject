import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const user = await prisma.user.findUnique({ where: { email } });

    await prisma.user.update({
      where: { email },
      data: { partialLogin: false },
    });

    const responseBody = JSON.stringify({
      success: true,
      message: "User updated and signed out",
    });
    return new Response(responseBody, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    const errorBody = JSON.stringify({
      success: false,
      message: "Failed to update user",
    });
    return new Response(errorBody, {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
