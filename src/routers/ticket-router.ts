import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getTicketTypes, getUserTickets, postTicket } from '@/controllers';

const ticketRouter = Router();

ticketRouter.all('/*', authenticateToken).get('/types', getTicketTypes).get('/', getUserTickets).post('/', postTicket);

export { ticketRouter };
