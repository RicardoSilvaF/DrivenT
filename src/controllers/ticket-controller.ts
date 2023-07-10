import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketService from '@/services/ticket-service';

export async function getTicketTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketTypes = await ticketService.getTicketTypesService();
    res.status(httpStatus.OK).send(ticketTypes);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function getUserTickets(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  try {
    const userTickets = await ticketService.getUserTicketsService(userId);
    if (!userTickets) {
      return res.status(httpStatus.NOT_FOUND).send('User does not have any tickets');
    }
    return res.status(httpStatus.OK).send(userTickets);
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
  }
}
