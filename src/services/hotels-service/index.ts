import hotelsRepository from '../../repositories/hotels-repository';
import { prisma } from '@/config';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError, paymentRequiredError } from '@/errors';

export async function getHotelListService(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const ticket = await prisma.ticket.findFirst({
    where: {
      enrollmentId: enrollment.id,
    },
    include: {
      TicketType: true,
    },
  });
  if (!ticket) {
    throw notFoundError();
  }
  if (ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw paymentRequiredError();
  }

  const hotels = await hotelsRepository.getHotelListRepository();
  if (!hotels || hotels.length === 0) {
    throw notFoundError();
  }
  return hotels;
}

export async function getHotelRoomsService(hotelId: number, userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const ticket = await prisma.ticket.findFirst({
    where: {
      enrollmentId: enrollment.id,
    },
    include: {
      TicketType: true,
    },
  });
  if (!ticket) {
    throw notFoundError();
  }
  if (ticket.status !== 'PAID' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw paymentRequiredError();
  }

  const hotelRooms = await hotelsRepository.getHotelRoomsRepository(hotelId);
  if (!hotelRooms) {
    throw notFoundError();
  }

  return hotelRooms;
}

const hotelsService = {
  getHotelListService,
  getHotelRoomsService,
};

export default hotelsService;
