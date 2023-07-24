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

const bookingRepository = {
  getBookingRepository,
  postBookingRepository,
};

export default bookingRepository;
