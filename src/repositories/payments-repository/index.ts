import { TicketStatus } from '@prisma/client';
import { prisma } from '@/config';
import { notFoundError } from '@/errors';
import { CardData } from '@/protocols';

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

export async function postPaymentsProcessRepository(ticketId: number, cardData: CardData) {
  const ticket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
    include: {
      TicketType: {
        select: {
          price: true,
        },
      },
      Payment: true,
    },
  });

  if (!ticket) {
    throw notFoundError();
  }

  const payment = await prisma.payment.create({
    data: {
      ticketId: ticket.id,
      value: ticket.TicketType.price,
      cardIssuer: cardData.issuer,
      cardLastDigits: cardData.number.toString().slice(-4),
    },
  });

  const updatedTicket = await prisma.ticket.update({
    where: {
      id: ticket.id,
    },
    data: {
      status: TicketStatus.PAID,
    },
  });

  const response = {
    id: payment.id,
    ticketId: updatedTicket.id,
    value: payment.value,
    cardIssuer: payment.cardIssuer,
    cardLastDigits: payment.cardLastDigits,
    createdAt: payment.createdAt,
    updatedAt: payment.updatedAt,
  };

  return response;
}

const paymentRepository = {
  getPaymentsByIdRepository,
  postPaymentsProcessRepository,
};

export default paymentRepository;
