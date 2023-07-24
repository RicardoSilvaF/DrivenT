import { Router } from 'express';
import { getBooking, postBooking } from '../controllers';
import { authenticateToken } from '@/middlewares';

const bookingsRouter = Router();

bookingsRouter.all('/*', authenticateToken).get('/', getBooking).post('/', postBooking);
// .put('/:bookingId', );

export { bookingsRouter };
