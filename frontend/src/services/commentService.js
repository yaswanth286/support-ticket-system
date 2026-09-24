import api from './api';

export async function getComments(ticketId) {
  const res = await api.get(`/tickets/${ticketId}/comments`);
  return res.data.data;
}

export async function addComment(ticketId, comment) {
  const res = await api.post(`/tickets/${ticketId}/comments`, { comment });
  return res.data.data;
}
