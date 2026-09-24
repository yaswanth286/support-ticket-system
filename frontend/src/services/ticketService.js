import api from './api';

export async function getTickets(filters = {}) {
  const res = await api.get('/tickets', { params: filters });
  return res.data.data;
}

export async function getTicketById(id) {
  const res = await api.get(`/tickets/${id}`);
  return res.data.data;
}

export async function createTicket(payload) {
  const res = await api.post('/tickets', payload);
  return res.data.data;
}

export async function updateTicket(id, payload) {
  const res = await api.put(`/tickets/${id}`, payload);
  return res.data.data;
}

export async function deleteTicket(id) {
  const res = await api.delete(`/tickets/${id}`);
  return res.data;
}
