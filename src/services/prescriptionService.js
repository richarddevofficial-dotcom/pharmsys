import api from '@/lib/axios';
export const prescriptionService = {
  getAll: (params) => api.get('/prescriptions/', { params }),
  create: (data) => api.post('/prescriptions/', data),
  update: (id, data) => api.put(`/prescriptions/${id}/`, data),
  delete: (id) => api.delete(`/prescriptions/${id}/`),
};
