import api from './api';

export async function getAgents() {
  const res = await api.get('/users');
  return res.data.data;
}
