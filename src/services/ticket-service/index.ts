import ticketRepository from '@/repositories/ticket-repository';
import { prisma } from '@/config';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError } from '@/errors';

export async function getTicketTypesService() {
  return await ticketRepository.getTicketTypesRepository();
}

export async function getUserTicketsService(userId: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      Enrollment: {
        include: {
          Ticket: {
            include: {
              TicketType: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  const enrollment = user.Enrollment[0];
  if (!enrollment || enrollment.Ticket.length === 0) {
    return null;
  }

  const ticket = enrollment.Ticket[0];

  return {
    id: ticket.id,
    status: ticket.status,
    ticketTypeId: ticket.ticketTypeId,
    enrollmentId: ticket.enrollmentId,
    TicketType: {
      id: ticket.TicketType.id,
      name: ticket.TicketType.name,
      price: ticket.TicketType.price,
      isRemote: ticket.TicketType.isRemote,
      includesHotel: ticket.TicketType.includesHotel,
      createdAt: ticket.TicketType.createdAt,
      updatedAt: ticket.TicketType.updatedAt,
    },
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  };
}

export async function postTicketService(userId: number, ticketTypeId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  return await ticketRepository.postTicketRepository(enrollment.id, ticketTypeId);
}

const ticketService = {
  getTicketTypesService,
  getUserTicketsService,
  postTicketService,
};

export default ticketService;
