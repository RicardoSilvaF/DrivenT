import { prisma } from '@/config';

async function getBookingRepository(bookingId: number) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { Room: true },
  });

  return booking;
}

const bookingRepository = {
  getBookingRepository,
};

export default bookingRepository;
