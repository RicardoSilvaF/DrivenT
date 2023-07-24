import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getTicketTypes, getUserTickets, postTicket } from '@/controllers';
import { ticketsSchema } from '@/schemas/tickets-schemas';

const ticketRouter = Router();

ticketRouter
  .all('/*', authenticateToken)
  .get('/types', getTicketTypes)
  .get('/', getUserTickets)
  .post('/', validateBody(ticketsSchema), postTicket);

export { ticketRouter };
