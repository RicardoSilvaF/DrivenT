import paymentRepository from '@/repositories/payment-repository';
import { prisma } from '@/config';
import { unauthorizedError, notFoundError } from '@/errors';

export async function getPaymentsByIdService(ticketId: number, userId: number) {
  const checkTicket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
  });

  if (!checkTicket) {
    throw notFoundError();
  }
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
  return await paymentRepository.getPaymentsByIdRepository(ticketId);
}

const paymentService = {
  getPaymentsByIdService,
};

export default paymentService;
