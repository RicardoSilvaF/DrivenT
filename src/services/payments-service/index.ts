import paymentRepository from '@/repositories/payments-repository';
import { prisma } from '@/config';
import { unauthorizedError, notFoundError } from '@/errors';
import { CardData } from '@/protocols';

export async function getPaymentsByIdService(ticketId: number, userId: number) {
  await checkTicketByTicketId(ticketId);
  await checkUserByTicketId(ticketId, userId);
  return await paymentRepository.getPaymentsByIdRepository(ticketId);
}

export async function postPaymentsProcessService(userId: number, ticketId: number, cardData: CardData) {
  await checkTicketByTicketId(ticketId);
  await checkUserByTicketId(ticketId, userId);
  return await paymentRepository.postPaymentsProcessRepository(ticketId, cardData);
}

async function checkTicketByTicketId(ticketId: number) {
  const checkTicket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
  });

  if (!checkTicket) {
    throw notFoundError();
  }
}

async function checkUserByTicketId(ticketId: number, userId: number) {
  const checkUser = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
    include: {
      Enrollment: {
        include: {
          User: true,
        },
      },
    },
  });
  if (!checkUser || checkUser.Enrollment.User.id !== userId) {
    throw unauthorizedError();
  }
}

const paymentService = {
  getPaymentsByIdService,
  postPaymentsProcessService,
};

export default paymentService;
