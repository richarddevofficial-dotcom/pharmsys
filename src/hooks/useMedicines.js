"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import toast from "react-hot-toast";

export function useMedicines(params = {}) {
  return useQuery({
    queryKey: ["medicines", params],
    queryFn: async () => {
      const response = await api.get("/medicines/", { params });
      return response.data;
    },
  });
}

export function useMedicine(id) {
  return useQuery({
    queryKey: ["medicine", id],
    queryFn: async () => {
      const response = await api.get(`/medicines/${id}/`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateMedicine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/medicines/", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["medicines"]);
      toast.success("Medicine created successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || "Failed to create medicine");
    },
  });
}

export function useUpdateMedicine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/medicines/${id}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["medicines"]);
      toast.success("Medicine updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || "Failed to update medicine");
    },
  });
}

export function useDeleteMedicine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/medicines/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["medicines"]);
      toast.success("Medicine deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || "Failed to delete medicine");
    },
  });
}
