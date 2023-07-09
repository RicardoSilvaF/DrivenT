import { prisma } from '@/config';

export async function getTicketTypesRepository() {
  return await prisma.ticketType.findMany();
}

const ticketRepository = {
  getTicketTypesRepository,
};

export default ticketRepository;
