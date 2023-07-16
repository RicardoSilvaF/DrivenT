import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getPayments, postPaymentsProcess } from '@/controllers';

const paymentRouter = Router();

paymentRouter.all('/*', authenticateToken).get('/', getPayments).post('/process', postPaymentsProcess);

export { paymentRouter };
