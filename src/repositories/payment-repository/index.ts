import { prisma } from '@/config';
import { notFoundError } from '@/errors';

export async function getPaymentsByIdRepository(ticketId: number) {
  const payment = await prisma.payment.findFirst({
    where: {
      ticketId: ticketId,
    },
  });
  if (!payment) {
    throw notFoundError();
  }
  return payment;
}

const paymentRepository = {
  getPaymentsByIdRepository,
};

export default paymentRepository;
