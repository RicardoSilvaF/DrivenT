import { Response } from 'express';
import httpStatus from 'http-status';
import { getBookingService } from '@/services';
import { AuthenticatedRequest } from '@/middlewares';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const bookingId = parseInt(req.params.bookingId, 10);

  try {
    const result = await getBookingService(bookingId);
    if (!result) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
