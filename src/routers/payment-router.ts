import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getPayments } from '@/controllers';

const paymentRouter = Router();

paymentRouter.all('/*', authenticateToken).get('/', getPayments).post('/process');

export { paymentRouter };
