import { prisma } from '@/config';

async function getHotelListRepository() {
  return await prisma.hotel.findMany();
}

async function getHotelRoomsRepository(hotelId: number) {
  return prisma.hotel.findUnique({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

const hotelsRepository = {
  getHotelListRepository,
  getHotelRoomsRepository,
};

export default hotelsRepository;
