import api from "@/lib/axios";

export const userService = {
  getAll: () => api.get("/users/"),
  getById: (id) => api.get(`/users/${id}/`),
  create: (data) => {
    console.log("Creating user:", data);
    return api.post("/users/", data);
  },
  update: (id, data) => {
    console.log("Updating user:", id, data);
    return api.patch(`/users/${id}/`, data);
  },
  delete: (id) => api.delete(`/users/${id}/`),
  getCurrentUser: () => api.get("/users/me/"),
};
