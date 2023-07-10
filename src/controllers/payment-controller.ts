import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentService from '@/services/payment-service';

export async function getPayments(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const ticketId = parseInt(req.query.ticketId as string);
    if (!ticketId || isNaN(ticketId)) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const payment = await paymentService.getPaymentsByIdService(ticketId, userId);
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === 'UnauthorizedError') {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function postPaymentsProcess(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const { ticketId, cardData } = req.body;
    if (!ticketId || !cardData) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const paymentProcess = await paymentService.postPaymentsProcessService(userId, ticketId, cardData);

    return res.status(httpStatus.OK).send(paymentProcess);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === 'UnauthorizedError') {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
