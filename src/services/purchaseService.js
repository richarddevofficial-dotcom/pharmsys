import api from "@/lib/axios";

export const purchaseService = {
  getAll: (params) => api.get("/purchases/", { params }),
  create: (data) => api.post("/purchases/", data),
  getById: (id) => api.get(`/purchases/${id}/`),
  update: (id, data) => api.put(`/purchases/${id}/`, data),
};
