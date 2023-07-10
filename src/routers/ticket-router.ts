import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getTicketTypes, getUserTickets } from '@/controllers';

const ticketRouter = Router();

ticketRouter.all('/*', authenticateToken).get('/types', getTicketTypes).get('/', getUserTickets);

export { ticketRouter };
