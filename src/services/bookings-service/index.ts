import { prisma } from '@/config';
import bookingRepository from '@/repositories/bookings-repository';
import { forbiddenError, notFoundError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';

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
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    console.log('batata1');
    throw forbiddenError();
  }

  const ticket = await prisma.ticket.findFirst({
    where: { enrollmentId: enrollment.id },
    include: {
      TicketType: true,
    },
  });

  if (!ticket) {
    throw notFoundError();
  }
  if (ticket.status !== 'PAID') throw forbiddenError();

  const ticketType = await prisma.ticketType.findFirst({
    where: { id: ticket.ticketTypeId },
  });
  if (ticketType.isRemote === true || ticketType.includesHotel === false) throw forbiddenError();

  await RoomVacanciesChecker(roomId);

  const result = await bookingRepository.postBookingRepository(roomId, userId);
  return result;
}

export async function updateBookingService(roomId: number, userId: number, bookingId: number) {
  const booking = await bookingRepository.getBookingRepository(userId);
  if (!booking) {
    throw notFoundError();
  }

  await RoomVacanciesChecker(roomId);

  const result = await bookingRepository.updateBookingRepository(roomId, bookingId);

  return { bookingId: result.id };
}

async function RoomVacanciesChecker(roomId: number) {
  const roomCheck = await prisma.room.findFirst({
    where: {
      id: roomId,
    },
  });
  if (!roomCheck) {
    throw notFoundError();
  }

  const roomVacancies = await prisma.booking.findMany({
    where: { roomId },
  });
  if (roomVacancies.length > roomCheck.capacity) {
    throw forbiddenError();
  }
}
