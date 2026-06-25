import api from '@/lib/axios';
export const reportService = {
  getDashboard: () => api.get('/reports/dashboard/'),
  getAll: (params) => api.get('/reports/', { params }),
};
