import { Response } from 'express';
import httpStatus from 'http-status';
import hotelsService from '../services/hotels-service';
import { AuthenticatedRequest } from '@/middlewares';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const hotelList = await hotelsService.getHotelListService(userId);
    res.status(httpStatus.OK).send(hotelList);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === 'PaymentRequiredError') {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }

    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

// export async function getHotelRooms(req: AuthenticatedRequest, res: Response) {
//     try {

//     } catch (error) {

//     }
// }
