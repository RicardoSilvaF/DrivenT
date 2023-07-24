import { prisma } from '@/config';

async function getBookingRepository(userId: number) {
  const booking = prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    },
  });

  return booking;
}

async function postBookingRepository(roomId: number, userId: number) {
  return prisma.booking.create({
    data: {
      roomId,
      userId,
    },
  });
}

async function updateBookingRepository(roomId: number, bookingId: number) {
  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { roomId },
  });

  return updatedBooking;
}

const bookingRepository = {
  getBookingRepository,
  postBookingRepository,
  updateBookingRepository,
};

export default bookingRepository;
