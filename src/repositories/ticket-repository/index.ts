import { prisma } from '@/config';

export async function getTicketTypesRepository() {
  return await prisma.ticketType.findMany();
}

export async function postTicketRepository(enrollmentId: number, ticketTypeId: number) {
  return await prisma.ticket.create({
    data: {
      status: 'RESERVED',
      ticketTypeId,
      enrollmentId,
    },
    include: {
      TicketType: true,
    },
  });
}

const ticketRepository = {
  getTicketTypesRepository,
  postTicketRepository,
};

export default ticketRepository;
