import hotelsRepository from '../../repositories/hotels-repository';
import { prisma } from '@/config';
import bookingRepository from '@/repositories/bookings-repository';
import { notFoundError, paymentRequiredError } from '@/errors';

export async function getBookingService(bookingId: number) {
  const booking = await bookingRepository.getBookingRepository(bookingId);
  if (!booking) {
    throw notFoundError();
  }

  const result = {
    id: booking.id,
    Room: booking.Room,
  };

  return result;
}
