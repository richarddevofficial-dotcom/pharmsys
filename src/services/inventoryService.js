import api from "@/lib/axios";

export const inventoryService = {
  getAll: (params) =>
    api.get("/inventory/", {
      params: { ...params, page_size: 1000 },
    }),
  create: (data) => api.post("/inventory/", data),
  getById: (id) => api.get(`/inventory/${id}/`),
};
