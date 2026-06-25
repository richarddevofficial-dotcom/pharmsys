import api from '@/lib/axios';
export const salesService = {
  getAll: (params) => api.get('/sales/', { params }),
  create: (data) => api.post('/sales/', data),
  getById: (id) => api.get(`/sales/${id}/`),
};
