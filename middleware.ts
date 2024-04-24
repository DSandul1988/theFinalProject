import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/",
  },
});

export const config = {
  matcher: [
    "/users/:path*",
    "/favorites/:path*",
    "/properties/:path*",
    "/favorites/:path*",
    "/reservations/:path*",
    "/trips/:path*",
    "/conversations/:path*",
    "/adminProperties/:path*",
    "/adminReservations/:path*",
    "/adminFavorites/:path*",
    "/adminUsers/:path*",
  ],
};
