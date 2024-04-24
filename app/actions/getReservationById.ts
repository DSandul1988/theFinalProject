import prisma from "@/app/libs/prismadb";

const getReservationById = async (reservationId: string, listingId: string) => {
  // Use Prisma Client to fetch the reservation that matches both reservationId and listingId
  const reservation = await prisma.reservation.findFirst({
    where: {
      AND: [{ id: reservationId }, { listingId: listingId }],
    },
  });

  return reservation;
};

export default getReservationById;
