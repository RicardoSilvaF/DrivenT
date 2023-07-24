import { getUserTicketsService } from '../tickets-service';
import { prisma } from '@/config';
import bookingRepository from '@/repositories/bookings-repository';
import { forbiddenError, notFoundError } from '@/errors';

export async function getBookingService(userId: number) {
  const booking = await bookingRepository.getBookingRepository(userId);
  if (!booking) {
    throw notFoundError();
  }

  const result = {
    id: booking.id,
    Room: booking.Room,
  };

  return result;
}

export async function postBookingService(roomId: number, userId: number) {
  const userTickets = await getUserTicketsService(userId);
  if (
    !userTickets ||
    !userTickets.TicketType.isRemote ||
    !userTickets.TicketType.includesHotel ||
    userTickets.status !== 'PAID'
  ) {
    throw forbiddenError();
  }

  const roomCheck = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
  });
  if (!roomCheck) {
    throw notFoundError();
  }

  const roomVacancies = await prisma.booking.count({
    where: { roomId },
  });
  if (roomVacancies >= roomCheck.capacity) {
    throw forbiddenError();
  }

  const result = await bookingRepository.postBookingRepository(roomId, userId);
  return result;
}
