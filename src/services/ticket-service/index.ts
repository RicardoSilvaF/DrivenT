import ticketRepository from '@/repositories/ticket-repository';

export async function getTicketTypesService() {
  return await ticketRepository.getTicketTypesRepository();
}

const ticketService = {
  getTicketTypesService,
};

export default ticketService;
