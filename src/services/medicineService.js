import api from "@/lib/axios";

export const medicineService = {
  getAll: (params) =>
    api.get("/medicines/", {
      params: { ...params, page_size: 1000 },
    }),
  getById: (id) => api.get(`/medicines/${id}/`),
  create: (data) => api.post("/medicines/", data),
  update: (id, data) => api.put(`/medicines/${id}/`, data),
  delete: (id) => api.delete(`/medicines/${id}/`),
};

export const categoryService = {
  getAll: () => api.get("/categories/"),
  create: (data) => api.post("/categories/", data),
};
