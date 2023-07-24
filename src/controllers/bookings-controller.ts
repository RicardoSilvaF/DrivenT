import { Response } from 'express';
import httpStatus from 'http-status';
import { getBookingService, postBookingService, updateBookingService } from '@/services';
import { AuthenticatedRequest } from '@/middlewares';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const result = await getBookingService(userId);
    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { roomId } = req.body;
  const { userId } = req;
  try {
    const result = await postBookingService(roomId, userId);
    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  const { roomId } = req.body;
  const { userId } = req;
  const bookingId = Number(req.params.bookingId);
  try {
    const result = await updateBookingService(roomId, userId, bookingId);
    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
