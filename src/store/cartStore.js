import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  prescriptionItems: null,

  setPrescriptionItems: (items) => set({ prescriptionItems: items }),

  clearPrescriptionItems: () => set({ prescriptionItems: null }),

  getPrescriptionItems: () => get().prescriptionItems,
}));
