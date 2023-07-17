import { prisma } from '@/config';

async function getHotelListRepository() {
  return await prisma.hotel.findMany();
}

// async function getHotelRoomsRepository() {

// }

const hotelsRepository = {
  getHotelListRepository,
  //getHotelRoomsRepository
};

export default hotelsRepository;
