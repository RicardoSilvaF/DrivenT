import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
  createEnrollmentWithAddress,
  createUser,
  createTicket,
  createTicketType,
  createHotel,
  createHotelRoom,
  createPayment,
  createBooking,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when user doesnt have an booking yet', async () => {
      const token = await generateValidToken();

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and with booking data', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true); // isRemote = false, includesHotel = true
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const hotel = await createHotel();
      const room = await createHotelRoom(hotel.id);
      const booking = await createBooking(user.id, room.id);
      const { status, body } = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(status).toBe(httpStatus.OK);

      expect(body).toEqual({
        id: booking.id,
        Room: expect.any(Object),
      });
    });
  });
});

describe('POST /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 200 and return booking id', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createHotelRoom(hotel.id);

      const { status, body } = await server.post('/booking').set('Authorization', `Bearer ${token}`);

      expect(status).toBe(httpStatus.OK);
      expect(body).toEqual({
        bookingId: expect.any(Number),
      });
    });

    it('should respond with status 404 when not exist roomId', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createHotelRoom(hotel.id);

      const response = await server
        .post('/booking')
        .set('Authorization', `Bearer ${token}`)
        .send({
          roomId: room.id + 1,
        });

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
    it("should respond with status 403 when there's not vacancies", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createHotelRoom(hotel.id);
      await createBooking(user.id, room.id);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
        roomId: room.id,
      });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 if user has not enrollment', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createTicketType();

      const hotel = await createHotel();
      const room = await createHotelRoom(hotel.id);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
        roomId: room.id,
      });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 if user has not payment', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const hotel = await createHotel();
      const room = await createHotelRoom(hotel.id);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
        roomId: room.id,
      });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });
  });
});

describe('PUT /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 200 and return new booking id', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createHotelRoom(hotel.id);
      const booking = await createBooking(user.id, room.id);
      const editBooking = await createHotelRoom(hotel.id);

      const { status, body } = await server
        .put(`/booking/${booking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: editBooking.id });

      expect(status).toBe(httpStatus.OK);
      expect(body).toEqual({
        bookingId: expect.any(Number),
      });
    });
  });
});
