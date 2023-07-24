import { prisma } from '@/config';

async function getBookingRepository(userId: number) {
  const booking = await prisma.booking.findFirst({
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
  const result = await prisma.booking.create({
    data: {
      roomId,
      userId,
    },
  });
  console.log(result.id);
  return result.id;
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
