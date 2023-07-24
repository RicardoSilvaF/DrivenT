import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketService from '@/services/tickets-service';

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
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function postTicket(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    const { ticketTypeId } = req.body;
    if (!userId) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (!ticketTypeId) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    const newTicket = await ticketService.postTicketService(userId, ticketTypeId);

    return res.status(201).send(newTicket);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
